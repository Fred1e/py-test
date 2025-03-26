import tkinter as tk
import random

class PythonLearningApp:
    def __init__(self, root):
        self.root = root
        self.root.title("Python Learning Application")
        self.root.geometry("800x600")
        self.root.configure(bg="black")

        # Create a canvas for animation
        self.canvas = tk.Canvas(self.root, width=800, height=600, bg="black")
        self.canvas.pack(fill="both", expand=True)

        # Display Welcome Text
        self.text = self.canvas.create_text(400, 100, text="Hello World!",
                                            font=("Arial", 24, "bold"), fill="white")
        self.text2 = self.canvas.create_text(400, 150, text="Welcome to Python Learning Application🎊🎊",
                                             font=("Arial", 18), fill="white")

        # Create moving boxes
        self.boxes = []
        for _ in range(4):
            x1, y1 = random.randint(50, 750), random.randint(200, 500)
            x2, y2 = x1 + 50, y1 + 50
            box = self.canvas.create_rectangle(x1, y1, x2, y2, fill="white", outline="")
            self.boxes.append((box, random.choice([-2, 2]), random.choice([-2, 2])))  # Speed in X, Y

        # Start animation
        self.animate_boxes()

    def animate_boxes(self):
        for i, (box, dx, dy) in enumerate(self.boxes):
            x1, y1, x2, y2 = self.canvas.coords(box)

            # Move boxes
            if x1 + dx < 0 or x2 + dx > 800:
                dx = -dx  # Reverse direction on X-axis
            if y1 + dy < 200 or y2 + dy > 600:
                dy = -dy  # Reverse direction on Y-axis
            
            self.canvas.move(box, dx, dy)
            self.boxes[i] = (box, dx, dy)  # Update direction

        self.root.after(50, self.animate_boxes)  # Repeat animation

# Run the application
if __name__ == "__main__":
    root = tk.Tk()
    app = PythonLearningApp(root)
    root.mainloop()
