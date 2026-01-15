import os
from playwright.sync_api import sync_playwright, expect

def test_kumaju_wave(page):
    cwd = os.getcwd()
    file_path = f"file://{cwd}/index.html"
    print(f"Loading {file_path}")
    page.goto(file_path)

    # 1. Start Game
    page.locator("#menu-start-btn").click()
    page.locator("button[data-stage='1']").click()
    expect(page.locator("#game-screen")).to_be_visible()

    # 2. Wait for Cannon Charge
    print("Waiting for Kumaju to charge (approx 7s)...")
    btn = page.locator("#fire-cannon-btn")
    expect(btn).to_contain_text("くまじゅう")

    # Wait for enabled state (class 'ready' is added)
    expect(btn).to_have_class("system-btn ready", timeout=10000)
    print("Kumaju ready!")

    # 3. Fire! (Force click because background updates constantly)
    print("Firing...")
    btn.click(force=True)

    # 4. Verify Wave Existence
    wave = page.locator(".hadou-wave")
    expect(wave).to_be_visible()
    print("Wave element found!")

    # Take Screenshot mid-animation
    page.wait_for_timeout(300)
    page.screenshot(path="verification/wave_verification.png")
    print("Screenshot saved.")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            test_kumaju_wave(page)
        except Exception as e:
            print(f"Test failed: {e}")
            page.screenshot(path="verification/wave_error.png")
            raise e
        finally:
            browser.close()
