import io
from PyPDF2 import PdfReader
from pdfminer.converter import TextConverter
from pdfminer.layout import LAParams
from pdfminer.pdfinterp import PDFResourceManager, PDFPageInterpreter
from pdfminer.pdfpage import PDFPage

# this highlight extractor using fitz works on documents highlighted using Adobe Acrobat Reader. In the Adobe Acrobat Reader app, the highlight is merely a colored overlay and doesn't actually contain the text of the highlight. So, this function uses the bounding box of the highlight to extract the text underneath it.

# limitations: if you highlighted one cell of text that is organized in a grid table, it will not work
import fitz


def extract_highlights(file_path):
    doc = fitz.open(file_path)

    highlights = []
    for page in doc:
        # PyMuPDF's method of accessing annotations
        for annot in page.annots():
            if annot.type[0] == 8:  # 'highlight' annotation type is 8
                # Rectangle instance, representing the bbox that encloses the annotation
                rect = annot.rect
                words = page.get_textbox(rect)
                highlights.append(words)

    return highlights
