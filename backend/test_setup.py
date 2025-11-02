#!/usr/bin/env python3
"""
Simple test script to verify the backend setup is working correctly.
Run this after setting up the backend to ensure all dependencies are installed.
"""

import sys
import importlib
import os
from pathlib import Path

def test_python_version():
    """Test if Python version is compatible"""
    print("🐍 Testing Python version...")
    version = sys.version_info
    if version.major >= 3 and version.minor >= 8:
        print(f"✅ Python {version.major}.{version.minor}.{version.micro} - Compatible")
        return True
    else:
        print(f"❌ Python {version.major}.{version.minor}.{version.micro} - Requires Python 3.8+")
        return False

def test_dependencies():
    """Test if all required dependencies are installed"""
    print("\n📦 Testing required dependencies...")
    
    required_packages = [
        'fastapi',
        'uvicorn',
        'fitz',  # PyMuPDF
        'cv2',   # opencv-python
        'PIL',   # Pillow
        'numpy',
        'torch',
        'pdf2image',
        'pydantic'
    ]
    
    failed_imports = []
    
    for package in required_packages:
        try:
            importlib.import_module(package)
            print(f"✅ {package}")
        except ImportError:
            print(f"❌ {package} - Not installed")
            failed_imports.append(package)
    
    return len(failed_imports) == 0

def test_optional_dependencies():
    """Test optional dependencies (OCR)"""
    print("\n📦 Testing optional dependencies...")
    
    # Test pytesseract
    try:
        import pytesseract
        print("✅ pytesseract - Available")
        
        # Test if Tesseract engine is installed
        try:
            version = pytesseract.get_tesseract_version()
            print(f"✅ Tesseract OCR engine - v{version}")
            return True
        except Exception as e:
            print(f"⚠️  Tesseract OCR engine - Not installed ({e})")
            print("💡 OCR is optional. See OPTIONAL_OCR_SETUP.md for installation")
            return False
            
    except ImportError:
        print("⚠️  pytesseract - Not installed (optional)")
        print("💡 OCR is optional. Install with: pip install pytesseract")
        return False

def test_directories():
    """Test if required directories exist"""
    print("\n📁 Testing directories...")
    
    required_dirs = ['uploads', 'outputs']
    missing_dirs = []
    
    for dir_name in required_dirs:
        dir_path = Path(dir_name)
        if dir_path.exists():
            print(f"✅ {dir_name}/ directory exists")
        else:
            print(f"❌ {dir_name}/ directory missing")
            missing_dirs.append(dir_name)
    
    return len(missing_dirs) == 0

def test_environment():
    """Test if environment file exists"""
    print("\n🔧 Testing environment...")
    
    env_file = Path('.env')
    if env_file.exists():
        print("✅ .env file exists")
        return True
    else:
        print("❌ .env file missing")
        print("💡 Copy .env.example to .env")
        return False

def test_fastapi_import():
    """Test if FastAPI can be imported and basic app created"""
    print("\n🚀 Testing FastAPI...")
    
    try:
        from fastapi import FastAPI
        app = FastAPI()
        print("✅ FastAPI can be imported and app created")
        return True
    except Exception as e:
        print(f"❌ FastAPI test failed: {e}")
        return False

def main():
    """Run all tests"""
    print("🧪 AI PDF Watermark Remover - Backend Setup Test")
    print("=" * 50)
    
    tests = [
        ("Python Version", test_python_version),
        ("Required Dependencies", test_dependencies),
        ("Optional Dependencies", test_optional_dependencies),
        ("Directories", test_directories),
        ("Environment", test_environment),
        ("FastAPI", test_fastapi_import)
    ]
    
    results = []
    
    for test_name, test_func in tests:
        try:
            result = test_func()
            # Optional dependencies don't count as failures
            if test_name == "Optional Dependencies":
                results.append((test_name, result, True))  # Mark as optional
            else:
                results.append((test_name, result, False))  # Mark as required
        except Exception as e:
            print(f"❌ {test_name} test failed with error: {e}")
            is_optional = test_name == "Optional Dependencies"
            results.append((test_name, False, is_optional))
    
    print("\n" + "=" * 50)
    print("📊 Test Results:")
    
    passed = 0
    required_passed = 0
    total = len(results)
    required_total = 0
    
    for test_name, result, is_optional in results:
        if is_optional:
            status = "✅ AVAILABLE" if result else "⚠️  OPTIONAL"
        else:
            status = "✅ PASS" if result else "❌ FAIL"
            required_total += 1
            if result:
                required_passed += 1
        
        print(f"{status} - {test_name}")
        if result:
            passed += 1
    
    print(f"\n🎯 Score: {required_passed}/{required_total} required tests passed")
    print(f"📊 Overall: {passed}/{total} tests passed (including optional)")
    
    if required_passed == required_total:
        print("🎉 All required tests passed! Backend setup is ready.")
        print("\n🚀 You can now start the backend with:")
        print("   uvicorn main:app --reload --host 0.0.0.0 --port 8000")
        
        if passed < total:
            print("\n💡 Optional enhancements available:")
            print("   - Install OCR for better text detection: see OPTIONAL_OCR_SETUP.md")
    else:
        print("⚠️  Some required tests failed. Please fix the issues above.")
        print("\n💡 Common fixes:")
        print("   - Install missing dependencies: pip install -r requirements.txt")
        print("   - Create missing directories: mkdir uploads outputs")
        print("   - Copy environment file: cp .env.example .env")
    
    return required_passed == required_total

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)