from playwright.sync_api import sync_playwright
import time

def debug_demo_mode():
    print("Debugging Demo Mode locally...")

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)  # Show browser for debugging
        context = browser.new_context()
        page = context.new_page()

        # Capture console errors
        errors = []
        page.on("console", lambda msg: errors.append(f"[{msg.type}] {msg.text}") if msg.type == "error" else None)
        page.on("pageerror", lambda err: errors.append(f"[PAGE ERROR] {err}"))

        # Navigate to member login
        print("1. Navigating to http://localhost:3002/member/login")
        page.goto("http://localhost:3002/member/login")
        page.wait_for_load_state('networkidle')
        time.sleep(2)

        # Click demo mode
        print("2. Clicking 'Enter Demo Mode'...")
        demo_button = page.locator("text=Enter Demo Mode")
        if demo_button.count() > 0:
            demo_button.click()

            # Wait for dashboard
            print("3. Waiting for dashboard...")
            page.wait_for_load_state('networkidle')
            time.sleep(3)

            print(f"4. Current URL: {page.url}")

            # Try navigating to other pages
            print("5. Navigating to /member/bookings...")
            page.goto("http://localhost:3002/member/bookings")
            page.wait_for_load_state('networkidle')
            time.sleep(2)

            print(f"6. Current URL: {page.url}")

        # Print any errors
        print("\n=== Console Errors ===")
        if errors:
            for err in errors:
                print(err)
        else:
            print("No console errors captured")

        print("\nKeeping browser open for 10 seconds...")
        time.sleep(10)
        browser.close()

if __name__ == "__main__":
    debug_demo_mode()
