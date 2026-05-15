from manim import *

class BubbleSortVeda(Scene):
    def construct(self):
        # Exact veda.ng design patterns from globals.css
        self.camera.background_color = "#FFFFFF" # --background: 0 0% 100%
        
        Text.set_default(color="#09090B", font="Helvetica") # --foreground: 240 10% 3.9%
        title = Text("Bubble Sort Algorithm", font_size=40, weight=BOLD).to_edge(UP, buff=1)
        self.play(Write(title))

        values = [50, 20, 80, 40, 90, 10, 60, 30, 70]
        rects = VGroup()
        for i, val in enumerate(values):
            # Using veda.ng primary color: hsl(210, 90%, 40%) -> #0A66C2
            rect = Rectangle(width=0.6, height=val*0.06, color="#0A66C2", fill_opacity=1, stroke_width=0)
            rects.add(rect)
        
        rects.arrange(RIGHT, buff=0.2).next_to(title, DOWN, buff=1.5)
        
        # Align bottoms perfectly
        for r in rects:
            r.align_to(rects, DOWN)
            
        self.play(Create(rects))
        
        for i in range(len(values)):
            for j in range(len(values) - i - 1):
                # highlight active comparison
                self.play(
                    rects[j].animate.set_color("#E11D48"), # rose-600
                    rects[j+1].animate.set_color("#E11D48"),
                    run_time=0.15
                )
                
                if values[j] > values[j+1]:
                    values[j], values[j+1] = values[j+1], values[j]
                    
                    # Store X coordinates
                    x_left = rects[j].get_x()
                    x_right = rects[j+1].get_x()
                    
                    # Animate ONLY X to preserve bottom alignment
                    self.play(
                        rects[j].animate.set_x(x_right),
                        rects[j+1].animate.set_x(x_left),
                        run_time=0.25,
                        rate_func=smooth
                    )
                    
                    # Swap in the VGroup
                    rects.submobjects[j], rects.submobjects[j+1] = rects.submobjects[j+1], rects.submobjects[j]

                # unhighlight
                self.play(
                    rects[j].animate.set_color("#0A66C2"),
                    rects[j+1].animate.set_color("#0A66C2"),
                    run_time=0.15
                )
            # Mark as sorted using a clean slate/green color
            self.play(rects[len(values) - i - 1].animate.set_color("#10B981"), run_time=0.1)
        self.wait(2)
