import os
import shutil
from PIL import Image

class OCRService:
    @staticmethod
    def extract_text(file_path):
        """
        Extracts text from medical reports using Tesseract.
        FALLBACK: If Tesseract binary is not found, it returns a trigger 
        for Gemini's multimodal analysis.
        """
        print(f"📄 [OCR] Processing: {file_path}")
        
        # 1. Check if Tesseract is physically installed on the system
        tesseract_path = shutil.which("tesseract")
        
        if not tesseract_path:
            print("⚠️ [OCR] Tesseract binary not found. Falling back to Gemini Multimodal.")
            return "[Multimodal Processing Triggered]"

        # 2. If installed, attempt local extraction
        try:
            import pytesseract
            # Set path explicitly if needed, but shutil.which already confirmed it's in PATH
            text = pytesseract.image_to_string(Image.open(file_path))
            return text if text.strip() else "[Empty OCR Result - Fallback Trigger]"
        except Exception as e:
            print(f"❌ [OCR] Tesseract Error: {str(e)}")
            return "[Multimodal Processing Triggered]"

    @staticmethod
    def is_tesseract_available():
        return shutil.which("tesseract") is not None
