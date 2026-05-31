#!/bin/bash
# Install Pre-compiled Waterfox G6.0.13

INSTALL_DIR="$HOME/programs/waterfox"
WATERFOX_URL="https://cdn.waterfox.com/waterfox/releases/G6.0.13/Linux_x86_64/waterfox-G6.0.13.tar.bz2"

echo "Creating installation directory at $INSTALL_DIR..."
mkdir -p "$INSTALL_DIR"

echo "Downloading and extracting Waterfox..."
curl -L "$WATERFOX_URL" | tar -xj -C "$INSTALL_DIR"

echo "Installation complete! You can launch Waterfox by running:"
echo "DISPLAY=:0 $INSTALL_DIR/waterfox/waterfox &"
