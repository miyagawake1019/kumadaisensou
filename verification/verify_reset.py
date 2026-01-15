import os
from playwright.sync_api import sync_playwright, expect

def test_reset_feature(page):
    # Load the game
    cwd = os.getcwd()
    file_path = f"file://{cwd}/index.html"
    print(f"Loading {file_path}")
    page.goto(file_path)

    # 1. Simulate Progress
    # Hack the localStorage via console to simulate cleared stages and coins
    print("Simulating progress (Stage 5 cleared, 99999 coins)...")
    page.evaluate("""
        const data = {
            coins: 99999,
            unlockedUnits: ['little', 'big'],
            unitLevels: { 'little': 10 },
            selectedDeck: ['little'],
            maxStageCleared: 5
        };
        localStorage.setItem('kuma_wars_data', JSON.stringify(data));
        // Reload page to apply
        location.reload();
    """)

    # Wait for reload
    page.wait_for_timeout(500)

    # Verify coins
    coins_display = page.locator("#player-coins")
    expect(coins_display).to_have_text("99999")
    print("Coins verified: 99999")

    # 2. Perform Reset
    reset_btn = page.locator("#reset-all-btn")
    expect(reset_btn).to_be_visible()

    # Handle Dialog
    page.on("dialog", lambda dialog: dialog.accept())

    print("Clicking Reset...")
    reset_btn.click()

    # Wait for update
    page.wait_for_timeout(500)

    # 3. Verify Reset
    # Coins should be 1000 (default)
    expect(coins_display).to_have_text("1000")
    print("Coins reset to 1000.")

    # Check LocalStorage
    data = page.evaluate("localStorage.getItem('kuma_wars_data')")
    print(f"LocalStorage after reset: {data}")

    # Take screenshot
    page.screenshot(path="verification/reset_verification.png")
    print("Screenshot saved.")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            test_reset_feature(page)
        except Exception as e:
            print(f"Test failed: {e}")
            page.screenshot(path="verification/reset_error.png")
            raise e
        finally:
            browser.close()
