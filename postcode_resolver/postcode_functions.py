def clean_postcode(dirty_postcode: str) -> str:
    cleaned_postcode = dirty_postcode.replace(" ", "").upper()
    return cleaned_postcode
