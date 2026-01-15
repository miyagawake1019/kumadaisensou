import os
from playwright.sync_api import sync_playwright, expect

def test_kb_and_visuals(page):
    cwd = os.getcwd()
    file_path = f"file://{cwd}/index.html"
    print(f"Loading {file_path}")
    page.goto(file_path)

    # 1. Start Game
    page.locator("#menu-start-btn").click()
    page.locator("button[data-stage='1']").click()

    # 2. Hack Unlock
    print("Hacking Tofu Bear unlock...")
    page.evaluate("""
        const data = {
            coins: 5000,
            unlockedUnits: ['tofu_kuma'],
            unitLevels: { 'tofu_kuma': 1 },
            selectedDeck: ['tofu_kuma'],
            maxStageCleared: 0
        };
        localStorage.setItem('kuma_wars_data', JSON.stringify(data));
        location.reload();
    """)
    page.wait_for_timeout(500)

    # 3. Start Game Again
    page.locator("#menu-start-btn").click()
    page.locator("button[data-stage='1']").click()

    # 4. Summon Tofu
    print("Summoning Tofu...")
    btn = page.locator("button[data-type='tofu_kuma']")
    btn.click(force=True)

    # 5. Check visuals
    # Capture the game screen to see Towers and Unit
    page.wait_for_timeout(1000)
    page.screenshot(path="verification/kb_verification.png")
    print("Screenshot saved.")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            test_kb_and_visuals(page)
        except Exception as e:
            print(f"Test failed: {e}")
            page.screenshot(path="verification/kb_error.png")
            raise e
        finally:
            browser.close()
