from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4, landscape
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "downloads"
OUT.mkdir(exist_ok=True)

FONT_PATH = Path(r"C:\Windows\Fonts\NotoSansTC-VF.ttf")
FONT_NAME = "NotoSansTC"
pdfmetrics.registerFont(TTFont(FONT_NAME, str(FONT_PATH)))


def draw_header(c, title):
    width, height = landscape(A4)
    c.setFont(FONT_NAME, 24)
    c.drawString(42, height - 48, title)
    c.setFont(FONT_NAME, 12)
    c.drawString(
        42,
        height - 76,
        "主題：____________________    姓名：____________________    日期：____________________",
    )
    c.setLineWidth(1.5)
    c.line(42, height - 90, width - 42, height - 90)
    return width, height


def make_nine_grid():
    path = OUT / "blank-nine-grid.pdf"
    c = canvas.Canvas(str(path), pagesize=landscape(A4))
    width, height = draw_header(c, "空白九宮格學習單")
    left, bottom = 78, 96
    size = min((width - 156) / 3, (height - 150) / 3)
    c.setLineWidth(1.4)
    for row in range(3):
        for col in range(3):
            x = left + col * size
            y = bottom + (2 - row) * size
            c.rect(x, y, size, size)
    c.setFont(FONT_NAME, 18)
    c.drawCentredString(left + 1.5 * size, bottom + 1.5 * size - 8, "主題")
    c.setFont(FONT_NAME, 12)
    c.drawString(42, 52, "整理提醒：每格只寫一個關鍵概念，再補一句說明。避免直接抄整段文章。")
    c.save()
    return path


def make_mind_map():
    path = OUT / "blank-mind-map.pdf"
    c = canvas.Canvas(str(path), pagesize=landscape(A4))
    width, height = draw_header(c, "空白心智圖學習單")
    center_x, center_y = width / 2, height / 2 - 12
    boxes = [
        (center_x, center_y, "主題"),
        (150, height - 170, "概念"),
        (width - 150, height - 170, "概念"),
        (150, 150, "概念"),
        (width - 150, 150, "概念"),
        (center_x, height - 155, "概念"),
        (center_x, 122, "概念"),
    ]
    c.setLineWidth(1.4)
    for x, y, _ in boxes[1:]:
        c.line(center_x, center_y, x, y)
    for x, y, label in boxes:
        c.setFillColor(colors.white)
        c.setStrokeColor(colors.black)
        c.roundRect(x - 68, y - 28, 136, 56, 12, stroke=1, fill=1)
        c.setFillColor(colors.black)
        c.setFont(FONT_NAME, 15)
        c.drawCentredString(x, y - 6, label)
    c.setFont(FONT_NAME, 12)
    c.drawString(42, 52, "整理提醒：在連線旁補上關係詞，例如：造成、幫助、影響、補充、需要。")
    c.save()
    return path


if __name__ == "__main__":
    print(make_nine_grid())
    print(make_mind_map())
