# Trading Pipeline & Model Lifecycle

Detailed documentation for the Kalshi auto-trading system.

## Data Pipeline (Sensor Layer)
- **Target:** Kalshi BTC/USD prediction markets.
- **Collectors:** Python-based scrapers running on RPi4.
- **Storage:** Local snapshots and candle data synchronized to the main workstation for training.

## Model: XGBoost Classifier
- **Input Features:** Orderbook depth (bids/asks), recent candle volume, trade velocity.
- **Output:** Probability of market settlement (binary classification).
- **Inference:** Done in real-time by `kalshi-auto-trader`.
- **Latency Optimization:** The trader uses `pick_device()` to run on GPU if available, or CPU if the GPU is busy with a "Meta-Layer" LLM task.

## The "Meta-Layer"
Unlike the execution model, the Meta-Layer uses large frontier models to:
1. **Feature Engineering:** Propose new mathematical transforms on orderbook data.
2. **Backtest Analysis:** Review P&L charts to identify regime changes (e.g., "market became more volatile, need wider spreads").
3. **Self-Repair:** Automatically adjust hyperparameters in `train_classifier_with_orderbook.py`.

## Feedback Loops
1. **P&L Stop:** Automated drawdown halt if the bankroll drops below a specific threshold.
2. **Retrain Trigger:** Monitor "Holdout AUC". If performance on new data drops below the training AUC by >5%, a retraining cycle is initiated.
3. **Capital Scaling:** Reinvestment rules that adjust position sizes relative to total equity.
