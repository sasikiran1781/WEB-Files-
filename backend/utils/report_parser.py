import re

class ReportParser:
    """
    Utility class for parsing specific medical values from text using regex patterns.
    Used as a fallback or verification for AI extraction.
    """
    
    @staticmethod
    def extract_with_regex(text, patterns):
        results = {}
        for key, pattern in patterns.items():
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                results[key] = match.group(1).strip()
        return results

    @staticmethod
    def get_standard_patterns():
        return {
            "creatinine": r"Creatinine[:\s]+([\d\.]+)",
            "urea": r"Urea[:\s]+([\d\.]+)",
            "hemoglobin": r"(?:Hb|Hemoglobin)[:\s]+([\d\.]+)",
            "blood_pressure": r"(?:BP|Blood Pressure)[:\s]+([\d\/]+)"
        }
