from manim import *

class BubbleSortLight(Scene):
    def construct(self):
        # Light mode design pattern
        self.camera.background_color = "#f8fafc"
        
        Text.set_default(color="#0f172a", font="Helvetica")
        title = Text("Bubble Sort Algorithm", font_size=40, weight=BOLD).to_edge(UP)
        self.play(Write(title))

        values = [5, 2, 8, 4, 9, 1, 6, 3, 7]
        rects = VGroup()
        for i, val in enumerate(values):
            # Clean blue brand color
            rect = Rectangle(width=0.8, height=val*0.5, color="#3b82f6", fill_opacity=0.9, stroke_width=0)
            group = VGroup(rect)
            rects.add(group)
        
        rects.arrange(RIGHT, buff=0.2).next_to(title, DOWN, buff=1).align_to(rects, DOWN)
        for r in rects:
            r.align_to(rects, DOWN)
            
        self.play(Create(rects))
        
        for i in range(len(values)):
            for j in range(len(values) - i - 1):
                self.play(
                    rects[j][0].animate.set_color("#f59e0b"),
                    rects[j+1][0].animate.set_color("#f59e0b"),
                    run_time=0.1
                )
                if values[j] > values[j+1]:
                    values[j], values[j+1] = values[j+1], values[j]
                    self.play(
                        Swap(rects[j], rects[j+1]),
                        run_time=0.3
                    )
                    rects.submobjects[j], rects.submobjects[j+1] = rects.submobjects[j+1], rects.submobjects[j]

                self.play(
                    rects[j][0].animate.set_color("#3b82f6"),
                    rects[j+1][0].animate.set_color("#3b82f6"),
                    run_time=0.1
                )
            self.play(rects[len(values) - i - 1][0].animate.set_color("#10b981"), run_time=0.1)
        self.wait(1)
