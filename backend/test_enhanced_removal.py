#!/usr/bin/env python3
"""
Test script for enhanced watermark removal functionality
"""

import asyncio
import sys
from pathlib import Path
from services.watermark_remover import WatermarkRemover

async def test_enhanced_removal():
    """Test the enhanced watermark removal"""
    print("🧪 Testing Enhanced Watermark Removal")
    print("=" * 50)
    
    # Initialize the enhanced watermark remover
    remover = WatermarkRemover()
    
    # Test file (you'll need to provide a test PDF)
    test_file = Path("test_input.pdf")
    
    if not test_file.exists():
        print("❌ Test file 'test_input.pdf' not found")
        print("📝 Please place a PDF with Gemini logo or other AI watermarks in the backend directory")
        return
    
    try:
        print(f"🔍 Processing: {test_file}")
        
        # Process the PDF
        output_path = await remover.process_pdf("test", test_file)
        
        if output_path.exists():
            print(f"✅ Enhanced processing completed!")
            print(f"📄 Output saved to: {output_path}")
            print("\n🎯 Enhanced features tested:")
            print("  • AI logo detection (Gemini, ChatGPT, Claude)")
            print("  • Computer vision-based logo removal")
            print("  • Pattern-based watermark detection")
            print("  • Enhanced text watermark removal")
            print("  • Circular logo detection")
            print("  • Corner pattern removal")
        else:
            print("❌ Output file not created")
            
    except Exception as e:
        print(f"❌ Error during processing: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(test_enhanced_removal())