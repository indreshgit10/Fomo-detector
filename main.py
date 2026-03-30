from src.train import train_model
from src.simulate import run_simulation
import os

MODEL_PATH = "models/fomo_model.pkl"


def is_model_trained():
    return os.path.exists(MODEL_PATH)


def main():
    while True:
        print("\n==== FOMO BCI SYSTEM ====")
        print("1. Train Model")
        print("2. Run Simulation")
        print("3. Exit")

        choice = input("Enter choice: ").strip()

        if choice == "1":
            print("\n🧠 Training model...\n")
            train_model()

        elif choice == "2":
            if not is_model_trained():
                print("\n❌ Model not found! Train model first.\n")
                continue

            try:
                duration = int(input("Enter simulation time (seconds, default 300): ") or 300)
            except ValueError:
                print("⚠ Invalid input, using default 300 seconds.")
                duration = 300

            print("\n🚀 Starting simulation...\n")
            run_simulation(duration=duration)

        elif choice == "3":
            print("\n👋 Exiting system. Goodbye!")
            break

        else:
            print("\n❌ Invalid choice. Try again.\n")


if __name__ == "__main__":
    main()