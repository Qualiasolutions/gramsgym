from playwright.sync_api import sync_playwright
import os
import time

BASE_URL = "https://gramsgym.vercel.app"

# Create a test CSV file
test_csv_content = """name_en,name_ar,email,phone,whatsapp_number,membership_type,start_date,end_date,pt_sessions
Test User One,مستخدم اختبار واحد,testuser1@example.com,+962791111111,+962791111111,monthly,2024-01-01,2024-02-01,0
Test User Two,مستخدم اختبار اثنين,testuser2@example.com,+962792222222,+962792222222,quarterly,2024-01-01,2024-04-01,5"""

test_csv_path = '/tmp/test_members_import.csv'
with open(test_csv_path, 'w', encoding='utf-8') as f:
    f.write(test_csv_content)
print(f"Created test CSV at: {test_csv_path}")

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()

    print("\n1. Navigating to coach login...")
    page.goto(f"{BASE_URL}/coach/login")
    page.wait_for_load_state('networkidle')
    page.screenshot(path='/tmp/01_coach_login.png', full_page=True)
    print("   Screenshot saved: /tmp/01_coach_login.png")

    print("2. Clicking 'Enter Demo Mode' button...")
    demo_button = page.locator('text=Enter Demo Mode')
    if demo_button.count() > 0:
        demo_button.click()
        page.wait_for_load_state('networkidle')
        time.sleep(2)
        page.screenshot(path='/tmp/02_after_demo_click.png', full_page=True)
        print("   Screenshot saved: /tmp/02_after_demo_click.png")
        print(f"   Current URL: {page.url}")
    else:
        print("   Demo button not found!")

    print("3. Navigating to /coach/members...")
    page.goto(f"{BASE_URL}/coach/members")
    page.wait_for_load_state('networkidle')
    time.sleep(2)
    page.screenshot(path='/tmp/03_members_page.png', full_page=True)
    print("   Screenshot saved: /tmp/03_members_page.png")

    print("4. Looking for 'Import Excel' button...")
    import_button = page.locator('button:has-text("Import Excel")')
    if import_button.count() > 0:
        print("   Found Import Excel button, clicking...")
        import_button.click()
        page.wait_for_timeout(1000)
        page.screenshot(path='/tmp/04_import_dialog.png', full_page=True)
        print("   Screenshot saved: /tmp/04_import_dialog.png")

        print("5. Uploading test CSV file...")
        file_input = page.locator('input[type="file"]')
        if file_input.count() > 0:
            file_input.set_input_files(test_csv_path)
            page.wait_for_timeout(1000)
            page.screenshot(path='/tmp/05_file_selected.png', full_page=True)
            print("   Screenshot saved: /tmp/05_file_selected.png")

            print("6. Clicking 'Import Members' button...")
            import_members_btn = page.locator('button:has-text("Import Members")')
            if import_members_btn.count() > 0:
                print("   Clicking import button...")
                import_members_btn.click()

                # Wait for the import to process
                print("   Waiting for import to complete...")
                page.wait_for_timeout(5000)
                page.screenshot(path='/tmp/06_import_result.png', full_page=True)
                print("   Screenshot saved: /tmp/06_import_result.png")

                # Check for result alerts
                success_alert = page.locator('text=Import Successful')
                partial_alert = page.locator('text=Partial Import')
                failed_alert = page.locator('text=Import Failed')

                if success_alert.count() > 0:
                    print("\n   SUCCESS: Members imported successfully!")
                elif partial_alert.count() > 0:
                    print("\n   PARTIAL: Some members imported, some failed")
                elif failed_alert.count() > 0:
                    print("\n   FAILED: Import failed")
                    # Get error details
                    errors = page.locator('[class*="text-red"]').all()
                    for error in errors[:5]:
                        try:
                            print(f"     Error: {error.inner_text()}")
                        except:
                            pass
                else:
                    print("\n   Status unknown - check screenshot")
                    # Print any visible text that might indicate status
                    dialog_content = page.locator('[role="dialog"]')
                    if dialog_content.count() > 0:
                        text = dialog_content.inner_text()
                        print(f"   Dialog content:\n{text[:500]}")
            else:
                print("   Import Members button not found or disabled")
        else:
            print("   File input not found")
    else:
        print("   Import Excel button not found!")
        buttons = page.locator('button').all()
        print(f"   Found {len(buttons)} buttons on page:")
        for btn in buttons[:10]:
            try:
                print(f"     - {btn.inner_text()}")
            except:
                pass

    print("\nTest complete!")
    browser.close()
