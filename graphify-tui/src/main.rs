use std::{
    error::Error,
    fs::File,
    io::{self, BufReader, Stdout},
    path::{Path, PathBuf},
    process::{Command, Stdio},
    time::Duration,
};

use crossterm::{
    event::{self, DisableMouseCapture, EnableMouseCapture, Event, KeyCode},
    execute,
    terminal::{disable_raw_mode, enable_raw_mode, EnterAlternateScreen, LeaveAlternateScreen},
};
use ratatui::{
    backend::CrosstermBackend,
    layout::{Constraint, Direction, Layout},
    style::{Color, Modifier, Style},
    text::{Line, Span},
    widgets::{Block, Borders, List, ListItem, ListState, Paragraph, Wrap},
    Frame, Terminal,
};
use serde::Deserialize;

#[derive(Debug, Deserialize, Clone)]
struct Node {
    id: String,
    label: Option<String>,
    file_type: Option<String>,
    source_file: Option<String>,
    community: Option<serde_json::Value>,
}

#[derive(Debug, Deserialize, Clone)]
struct Link {
    source: String,
    target: String,
    relation: Option<String>,
}

#[derive(Debug, Deserialize, Clone)]
struct GraphData {
    nodes: Vec<Node>,
    #[serde(alias = "edges")]
    links: Vec<Link>,
}

#[derive(Copy, Clone, PartialEq)]
enum BackendMode {
    Ollama,
    OpenClaw,
}

struct App {
    target_path: PathBuf,
    graph: Option<GraphData>,
    nodes_state: ListState,
    filtered_nodes: Vec<Node>,
    active_panel: Panel,
    search_query: String,
    input_mode: InputMode,
    refinement_prompt: String,
    status_message: String,
    history: Vec<String>, // Tracks node-traversal history for backtracking
    neighbors: Vec<(String, String, String)>, // (Target node ID, Label, Relation)
    neighbors_state: ListState,
    log_output: String,
    backend: BackendMode,
}

#[derive(Copy, Clone, PartialEq)]
enum Panel {
    Nodes,
    Search,
    Neighbors,
    Refine,
}

#[derive(Copy, Clone, PartialEq)]
enum InputMode {
    Normal,
    Search,
    Refine,
}

impl App {
    fn new(path: PathBuf) -> App {
        let mut app = App {
            target_path: path,
            graph: None,
            nodes_state: ListState::default(),
            filtered_nodes: Vec::new(),
            active_panel: Panel::Nodes,
            search_query: String::new(),
            input_mode: InputMode::Normal,
            refinement_prompt: String::new(),
            status_message: String::from("Welcome! Press 's' to scan. 'b': Toggle Backend (Ollama/OpenClaw), 'a': Annotate, 'r': Refine."),
            history: Vec::new(),
            neighbors: Vec::new(),
            neighbors_state: ListState::default(),
            log_output: String::new(),
            backend: BackendMode::Ollama,
        };
        app.load_graph();
        app
    }

    fn load_graph(&mut self) {
        let graph_path = self.target_path.join("graphify-out").join("graph.json");
        if !graph_path.exists() {
            self.status_message = format!("❌ graph.json not found in {}. Run scan first.", self.target_path.display());
            return;
        }

        match File::open(&graph_path) {
            Ok(file) => {
                let reader = BufReader::new(file);
                match serde_json::from_reader::<_, GraphData>(reader) {
                    Ok(data) => {
                        self.status_message = format!("✓ Loaded {} nodes, {} edges.", data.nodes.len(), data.links.len());
                        self.graph = Some(data);
                        self.filter_nodes();
                        if !self.filtered_nodes.is_empty() {
                            self.nodes_state.select(Some(0));
                            self.update_neighbors();
                        }
                    }
                    Err(e) => {
                        self.status_message = format!("❌ Failed to parse graph.json: {}", e);
                    }
                }
            }
            Err(e) => {
                self.status_message = format!("❌ Failed to open graph.json: {}", e);
            }
        }
    }

    fn filter_nodes(&mut self) {
        if let Some(ref graph) = self.graph {
            let query = self.search_query.to_lowercase();
            self.filtered_nodes = graph
                .nodes
                .iter()
                .filter(|n| {
                    let label = n.label.as_deref().unwrap_or("").to_lowercase();
                    let file = n.source_file.as_deref().unwrap_or("").to_lowercase();
                    label.contains(&query) || file.contains(&query)
                })
                .cloned()
                .collect();
            
            // Adjust selection
            let selected = self.nodes_state.selected().unwrap_or(0);
            if self.filtered_nodes.is_empty() {
                self.nodes_state.select(None);
            } else if selected >= self.filtered_nodes.len() {
                self.nodes_state.select(Some(self.filtered_nodes.len() - 1));
            } else {
                self.nodes_state.select(Some(selected));
            }
            self.update_neighbors();
        }
    }

    fn update_neighbors(&mut self) {
        self.neighbors.clear();
        let selected_idx = match self.nodes_state.selected() {
            Some(i) => i,
            None => return,
        };
        let current_node = &self.filtered_nodes[selected_idx];
        let current_id = &current_node.id;

        if let Some(ref graph) = self.graph {
            for link in &graph.links {
                let relation = link.relation.clone().unwrap_or_else(|| String::from("connected"));
                if &link.source == current_id {
                    if let Some(target_node) = graph.nodes.iter().find(|n| &n.id == &link.target) {
                        let label = target_node.label.clone().unwrap_or_else(|| target_node.id.clone());
                        self.neighbors.push((target_node.id.clone(), label, format!("→ {}", relation)));
                    }
                } else if &link.target == current_id {
                    if let Some(source_node) = graph.nodes.iter().find(|n| &n.id == &link.source) {
                        let label = source_node.label.clone().unwrap_or_else(|| source_node.id.clone());
                        self.neighbors.push((source_node.id.clone(), label, format!("← {}", relation)));
                    }
                }
            }
        }
        if !self.neighbors.is_empty() {
            self.neighbors_state.select(Some(0));
        } else {
            self.neighbors_state.select(None);
        }
    }

    fn get_selected_node(&self) -> Option<&Node> {
        let idx = self.nodes_state.selected()?;
        self.filtered_nodes.get(idx)
    }

    fn select_node_by_id(&mut self, id: &str) {
        if let Some(idx) = self.filtered_nodes.iter().position(|n| n.id == id) {
            // Push previous selection to history
            if let Some(current) = self.get_selected_node() {
                self.history.push(current.id.clone());
            }
            self.nodes_state.select(Some(idx));
            self.update_neighbors();
        }
    }

    fn backtrack(&mut self) {
        if let Some(prev_id) = self.history.pop() {
            if let Some(idx) = self.filtered_nodes.iter().position(|n| n.id == prev_id) {
                self.nodes_state.select(Some(idx));
                self.update_neighbors();
            }
        }
    }

    fn execute_scan(&mut self) {
        self.status_message = String::from("⏳ Scanning codebase (AST extraction)...");
        let venv_bin = Path::new("/home/jeb/programs/gemini_cli_workspace/session_20260607_163152/graphify/.venv/bin/graphify");
        let graphify_cmd = if venv_bin.exists() {
            venv_bin.to_string_lossy().into_owned()
        } else {
            String::from("graphify")
        };

        // Rerun extract
        let output_extract = Command::new(&graphify_cmd)
            .args(&["extract", &self.target_path.to_string_lossy(), "--max-workers", "4"])
            .stdout(Stdio::piped())
            .stderr(Stdio::piped())
            .output();

        match output_extract {
            Ok(out) => {
                if !out.status.success() {
                    let err = String::from_utf8_lossy(&out.stderr);
                    self.status_message = format!("❌ Scan failed: {}", err.lines().next().unwrap_or("Unknown error"));
                    return;
                }
            }
            Err(e) => {
                self.status_message = format!("❌ Failed to execute graphify: {}", e);
                return;
            }
        }

        // Rerun clustering
        let output_cluster = Command::new(&graphify_cmd)
            .args(&["cluster-only", &self.target_path.to_string_lossy()])
            .output();

        match output_cluster {
            Ok(_) => {
                self.status_message = String::from("✓ Scan and clustering finished!");
                self.load_graph();
            }
            Err(e) => {
                self.status_message = format!("❌ Clustering failed: {}", e);
            }
        }
    }

    fn execute_refinement(&mut self) {
        let (label, file_path) = match self.get_selected_node() {
            Some(n) => (
                n.label.clone().unwrap_or_else(|| String::from("Untitled")),
                n.source_file.clone()
            ),
            None => return,
        };

        let file_path = match file_path {
            Some(sf) => sf,
            None => {
                self.status_message = String::from("❌ Node has no physical file source.");
                return;
            }
        };

        let backend_name = match self.backend {
            BackendMode::Ollama => "Ollama (gemma2)",
            BackendMode::OpenClaw => "OpenClaw",
        };

        self.status_message = format!("⏳ Refining {} with {}...", label, backend_name);
        
        // Execute refinement using selected backend
        let prompt_body = format!(
            "Refine and improve the code in the file: {}\nInstructions: {}\nOutput the fully updated file contents only, keeping standard comments.",
            file_path,
            self.refinement_prompt
        );

        let output = match self.backend {
            BackendMode::Ollama => {
                Command::new("ollama")
                    .args(&["run", "gemma2", &prompt_body])
                    .stdout(Stdio::piped())
                    .stderr(Stdio::piped())
                    .output()
            }
            BackendMode::OpenClaw => {
                Command::new("/home/jeb/.nvm/versions/node/v24.11.1/bin/openclaw")
                    .args(&["agent", "--local", "--message", &prompt_body])
                    .stdout(Stdio::piped())
                    .stderr(Stdio::piped())
                    .output()
            }
        };

        match output {
            Ok(out) => {
                if out.status.success() {
                    let code = String::from_utf8_lossy(&out.stdout);
                    // Write back refined code
                    if std::fs::write(&file_path, &*code).is_ok() {
                        self.status_message = format!("✓ Refined successfully: {}", file_path);
                        self.log_output = format!("=== Refined Code for {} ===\n{}", file_path, code);
                    } else {
                        self.status_message = format!("❌ Failed to write file: {}", file_path);
                    }
                } else {
                    let err = String::from_utf8_lossy(&out.stderr);
                    self.status_message = format!("❌ Refinement failed: {}", err);
                }
            }
            Err(e) => {
                self.status_message = format!("❌ Failed to contact {}: {}", backend_name, e);
            }
        }
        self.refinement_prompt.clear();
        self.input_mode = InputMode::Normal;
    }

    fn execute_annotation(&mut self) {
        let (label, file_path) = match self.get_selected_node() {
            Some(n) => (
                n.label.clone().unwrap_or_else(|| String::from("Untitled")),
                n.source_file.clone()
            ),
            None => return,
        };

        let file_path = match file_path {
            Some(sf) => sf,
            None => {
                self.status_message = String::from("❌ Node has no physical file source.");
                return;
            }
        };

        let backend_name = match self.backend {
            BackendMode::Ollama => "Ollama (gemma2)",
            BackendMode::OpenClaw => "OpenClaw",
        };

        self.status_message = format!("⏳ Annotating {} with {}...", label, backend_name);
        
        let prompt_body = format!(
            "Analyze the file: {}. Find the function or class labeled '{}' and add descriptive docstrings and inline comments to annotate it clearly. Output the fully updated file contents only, keeping the existing implementation intact.",
            file_path,
            label
        );

        let output = match self.backend {
            BackendMode::Ollama => {
                Command::new("ollama")
                    .args(&["run", "gemma2", &prompt_body])
                    .stdout(Stdio::piped())
                    .stderr(Stdio::piped())
                    .output()
            }
            BackendMode::OpenClaw => {
                Command::new("/home/jeb/.nvm/versions/node/v24.11.1/bin/openclaw")
                    .args(&["agent", "--local", "--message", &prompt_body])
                    .stdout(Stdio::piped())
                    .stderr(Stdio::piped())
                    .output()
            }
        };

        match output {
            Ok(out) => {
                if out.status.success() {
                    let code = String::from_utf8_lossy(&out.stdout);
                    // Write back annotated code
                    if std::fs::write(&file_path, &*code).is_ok() {
                        self.status_message = format!("✓ Annotated successfully: {}", file_path);
                        self.log_output = format!("=== Annotated Code for {} ===\n{}", file_path, code);
                    } else {
                        self.status_message = format!("❌ Failed to write file: {}", file_path);
                    }
                } else {
                    let err = String::from_utf8_lossy(&out.stderr);
                    self.status_message = format!("❌ Annotation failed: {}", err);
                }
            }
            Err(e) => {
                self.status_message = format!("❌ Failed to contact {}: {}", backend_name, e);
            }
        }
    }
}

fn main() -> Result<(), Box<dyn Error>> {
    // Setup terminal
    enable_raw_mode()?;
    let mut stdout = io::stdout();
    execute!(stdout, EnterAlternateScreen, EnableMouseCapture)?;
    let backend = CrosstermBackend::new(stdout);
    let mut terminal = Terminal::new(backend)?;

    // Create app
    let args: Vec<String> = std::env::args().collect();
    let target = if args.len() > 1 {
        PathBuf::from(&args[1])
    } else {
        PathBuf::from("/home/jeb/programs/gemini_cli_workspace")
    };
    let mut app = App::new(target);

    let res = run_app(&mut terminal, &mut app);

    // Restore terminal
    disable_raw_mode()?;
    execute!(
        terminal.backend_mut(),
        LeaveAlternateScreen,
        DisableMouseCapture
    )?;
    terminal.show_cursor()?;

    if let Err(err) = res {
        println!("{:?}", err);
    }

    Ok(())
}

fn run_app(
    terminal: &mut Terminal<CrosstermBackend<Stdout>>,
    app: &mut App,
) -> io::Result<()> {
    loop {
        terminal.draw(|f| ui(f, app))?;

        if event::poll(Duration::from_millis(100))? {
            if let Event::Key(key) = event::read()? {
                if key.kind == event::KeyEventKind::Release {
                    continue;
                }
                match app.input_mode {
                    InputMode::Normal => match key.code {
                        KeyCode::Char('q') => return Ok(()),
                        KeyCode::Char('s') => {
                            app.execute_scan();
                        }
                        KeyCode::Char('b') => {
                            app.backend = match app.backend {
                                BackendMode::Ollama => BackendMode::OpenClaw,
                                BackendMode::OpenClaw => BackendMode::Ollama,
                            };
                            let name = match app.backend {
                                BackendMode::Ollama => "Ollama (gemma2)",
                                BackendMode::OpenClaw => "OpenClaw",
                            };
                            app.status_message = format!("✓ Switched backend to {}", name);
                        }
                        KeyCode::Char('a') => {
                            if app.get_selected_node().is_some() {
                                app.execute_annotation();
                            } else {
                                app.status_message = String::from("❌ Select a code node first.");
                            }
                        }
                        KeyCode::Char('r') => {
                            if app.get_selected_node().is_some() {
                                app.input_mode = InputMode::Refine;
                                app.active_panel = Panel::Refine;
                            } else {
                                app.status_message = String::from("❌ Select a code node first.");
                            }
                        }
                        KeyCode::Char('/') => {
                            app.input_mode = InputMode::Search;
                            app.active_panel = Panel::Search;
                        }
                        KeyCode::Esc => {
                            app.backtrack();
                        }
                        KeyCode::Tab => {
                            app.active_panel = match app.active_panel {
                                Panel::Nodes => Panel::Neighbors,
                                Panel::Neighbors => Panel::Nodes,
                                _ => Panel::Nodes,
                            };
                        }
                        KeyCode::Up => match app.active_panel {
                            Panel::Nodes => {
                                let i = match app.nodes_state.selected() {
                                    Some(i) => {
                                        if i == 0 {
                                            app.filtered_nodes.len() - 1
                                        } else {
                                            i - 1
                                        }
                                    }
                                    None => 0,
                                };
                                app.nodes_state.select(Some(i));
                                app.update_neighbors();
                            }
                            Panel::Neighbors => {
                                let i = match app.neighbors_state.selected() {
                                    Some(i) => {
                                        if i == 0 {
                                            app.neighbors.len() - 1
                                        } else {
                                            i - 1
                                        }
                                    }
                                    None => 0,
                                };
                                app.neighbors_state.select(Some(i));
                            }
                            _ => {}
                        },
                        KeyCode::Down => match app.active_panel {
                            Panel::Nodes => {
                                let i = match app.nodes_state.selected() {
                                    Some(i) => {
                                        if i >= app.filtered_nodes.len() - 1 {
                                            0
                                        } else {
                                            i + 1
                                        }
                                    }
                                    None => 0,
                                };
                                app.nodes_state.select(Some(i));
                                app.update_neighbors();
                            }
                            Panel::Neighbors => {
                                let i = match app.neighbors_state.selected() {
                                    Some(i) => {
                                        if i >= app.neighbors.len() - 1 {
                                            0
                                        } else {
                                            i + 1
                                        }
                                    }
                                    None => 0,
                                };
                                app.neighbors_state.select(Some(i));
                            }
                            _ => {}
                        },
                        KeyCode::Enter => match app.active_panel {
                            Panel::Neighbors => {
                                if let Some(i) = app.neighbors_state.selected() {
                                    let target_id = app.neighbors[i].0.clone();
                                    app.select_node_by_id(&target_id);
                                }
                            }
                            _ => {}
                        },
                        _ => {}
                    },
                    InputMode::Search => match key.code {
                        KeyCode::Enter | KeyCode::Esc => {
                            app.input_mode = InputMode::Normal;
                            app.active_panel = Panel::Nodes;
                        }
                        KeyCode::Char(c) => {
                            app.search_query.push(c);
                            app.filter_nodes();
                        }
                        KeyCode::Backspace => {
                            app.search_query.pop();
                            app.filter_nodes();
                        }
                        _ => {}
                    },
                    InputMode::Refine => match key.code {
                        KeyCode::Enter => {
                            app.execute_refinement();
                        }
                        KeyCode::Esc => {
                            app.input_mode = InputMode::Normal;
                            app.active_panel = Panel::Nodes;
                        }
                        KeyCode::Char(c) => {
                            app.refinement_prompt.push(c);
                        }
                        KeyCode::Backspace => {
                            app.refinement_prompt.pop();
                        }
                        _ => {}
                    }
                }
            }
        }
    }
}

fn ui(f: &mut Frame, app: &mut App) {
    let size = f.size();

    // Base constraints
    let chunks = Layout::default()
        .direction(Direction::Vertical)
        .constraints([
            Constraint::Length(3), // Header
            Constraint::Min(10),   // Workspace body
            Constraint::Length(5), // Log / Refine status
            Constraint::Length(3), // Status / Keyboard help
        ])
        .split(size);

    let backend_name = match app.backend {
        BackendMode::Ollama => "Ollama (gemma2)",
        BackendMode::OpenClaw => "OpenClaw",
    };
    let header = Paragraph::new(vec![Line::from(vec![
        Span::styled("⚡ GRAPHIFY DEVELOPER CONSOLE  ", Style::default().fg(Color::Cyan).add_modifier(Modifier::BOLD)),
        Span::styled(format!("Target: {}  ", app.target_path.display()), Style::default().fg(Color::DarkGray)),
        Span::styled(format!("[Backend: {}]", backend_name), Style::default().fg(Color::LightGreen).add_modifier(Modifier::BOLD)),
    ])])
    .block(Block::default().borders(Borders::ALL).border_style(Style::default().fg(Color::Magenta)));
    f.render_widget(header, chunks[0]);

    // Split body into Left (Node Selection) and Right (Traversal / Details)
    let body_chunks = Layout::default()
        .direction(Direction::Horizontal)
        .constraints([Constraint::Percentage(40), Constraint::Percentage(60)])
        .split(chunks[1]);

    // 2. Left Panel: Node Selection
    let nodes_border_color = if app.active_panel == Panel::Nodes {
        Color::Cyan
    } else {
        Color::DarkGray
    };
    
    let nodes_list: Vec<ListItem> = app
        .filtered_nodes
        .iter()
        .map(|node| {
            let label = node.label.as_deref().unwrap_or("Untitled");
            let ftype = node.file_type.as_deref().unwrap_or("code");
            let style = match ftype {
                "file" | "code" => Style::default().fg(Color::Green),
                _ => Style::default().fg(Color::Yellow),
            };
            ListItem::new(vec![Line::from(vec![
                Span::styled(format!("[{}] ", ftype.chars().next().unwrap_or('C')), Style::default().fg(Color::DarkGray)),
                Span::styled(label, style),
            ])])
        })
        .collect();

    let list_widget = List::new(nodes_list)
        .block(Block::default().title(format!(" Code Symbols ({}) ", app.filtered_nodes.len())).borders(Borders::ALL).border_style(Style::default().fg(nodes_border_color)))
        .highlight_style(Style::default().bg(Color::Rgb(40, 40, 40)).add_modifier(Modifier::BOLD))
        .highlight_symbol("❯ ");
    f.render_stateful_widget(list_widget, body_chunks[0], &mut app.nodes_state);

    // Split Right Panel into Node Details and Traversable Links
    let right_chunks = Layout::default()
        .direction(Direction::Vertical)
        .constraints([Constraint::Percentage(55), Constraint::Percentage(45)])
        .split(body_chunks[1]);

    // 3. Details Panel
    let details_content = if let Some(node) = app.get_selected_node() {
        let community_str = match &node.community {
            Some(v) => v.to_string(),
            None => String::from("None"),
        };
        vec![
            Line::from(vec![
                Span::styled("Label:      ", Style::default().fg(Color::Yellow)),
                Span::styled(node.label.as_deref().unwrap_or("Untitled"), Style::default().fg(Color::White)),
            ]),
            Line::from(vec![
                Span::styled("Type:       ", Style::default().fg(Color::Yellow)),
                Span::styled(node.file_type.as_deref().unwrap_or("code"), Style::default().fg(Color::Green)),
            ]),
            Line::from(vec![
                Span::styled("Source:     ", Style::default().fg(Color::Yellow)),
                Span::styled(node.source_file.as_deref().unwrap_or("None"), Style::default().fg(Color::White)),
            ]),
            Line::from(vec![
                Span::styled("Community:  ", Style::default().fg(Color::Yellow)),
                Span::styled(community_str, Style::default().fg(Color::Magenta)),
            ]),
        ]
    } else {
        vec![Line::from("No symbol selected.")]
    };

    let details_widget = Paragraph::new(details_content)
        .block(Block::default().title(" Node Details ").borders(Borders::ALL).border_style(Style::default().fg(Color::DarkGray)))
        .wrap(Wrap { trim: true });
    f.render_widget(details_widget, right_chunks[0]);

    // 4. Neighbors / Traversal Panel
    let neighbors_border_color = if app.active_panel == Panel::Neighbors {
        Color::Cyan
    } else {
        Color::DarkGray
    };

    let neighbors_list: Vec<ListItem> = app
        .neighbors
        .iter()
        .map(|(_, label, rel)| {
            ListItem::new(vec![Line::from(vec![
                Span::styled(format!("{} ", rel), Style::default().fg(Color::Magenta)),
                Span::styled(label, Style::default().fg(Color::White)),
            ])])
        })
        .collect();

    let neighbors_widget = List::new(neighbors_list)
        .block(Block::default().title(" Graph Traversal Links (Press Enter to follow) ").borders(Borders::ALL).border_style(Style::default().fg(neighbors_border_color)))
        .highlight_style(Style::default().bg(Color::Rgb(40, 40, 40)).add_modifier(Modifier::BOLD))
        .highlight_symbol("👉 ");
    f.render_stateful_widget(neighbors_widget, right_chunks[1], &mut app.neighbors_state);

    // 5. Refinement Panel / Log Output
    let refine_chunks = Layout::default()
        .direction(Direction::Horizontal)
        .constraints([Constraint::Percentage(50), Constraint::Percentage(50)])
        .split(chunks[2]);

    let search_title = if app.input_mode == InputMode::Search {
        " Search (Type text, Esc to confirm) "
    } else {
        " Search (Press / to search) "
    };
    let search_widget = Paragraph::new(app.search_query.as_str())
        .block(Block::default().title(search_title).borders(Borders::ALL).border_style(Style::default().fg(
            if app.active_panel == Panel::Search { Color::Cyan } else { Color::DarkGray }
        )));
    f.render_widget(search_widget, refine_chunks[0]);

    let refine_title = if app.input_mode == InputMode::Refine {
        " Iterative Refinement (Instructions, Enter to run) "
    } else {
        " Refinement (Press 'r' to Refine via LLM) "
    };
    let refine_widget = Paragraph::new(app.refinement_prompt.as_str())
        .block(Block::default().title(refine_title).borders(Borders::ALL).border_style(Style::default().fg(
            if app.active_panel == Panel::Refine { Color::Cyan } else { Color::DarkGray }
        )));
    f.render_widget(refine_widget, refine_chunks[1]);

    // 6. Status / Help Bar
    let status_style = Style::default().fg(Color::Black).bg(Color::Cyan);
    let status_widget = Paragraph::new(app.status_message.as_str())
        .block(Block::default().borders(Borders::ALL).border_style(Style::default().fg(Color::DarkGray)))
        .style(status_style);
    f.render_widget(status_widget, chunks[3]);

    // Show modal if refining code or searching
    if app.input_mode == InputMode::Refine {
        // Just highlight the border
    }
}
