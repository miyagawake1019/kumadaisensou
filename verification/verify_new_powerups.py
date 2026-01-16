import os
from playwright.sync_api import sync_playwright, expect

def test_new_powerups(page):
    cwd = os.getcwd()
    file_path = f"file://{cwd}/index.html"
    print(f"Loading {file_path}")
    page.goto(file_path)

    # 1. Reset Game
    page.evaluate("localStorage.clear(); location.reload();")
    page.wait_for_timeout(500)

    # 2. Hack Data: Coins + Levels
    print("Hacking data...")
    page.evaluate("""
        const data = {
            coins: 50000,
            unlockedUnits: ['little'],
            unitLevels: { 'little': 1 },
            walletLevel: 1,
            researchLevel: 1,
            accountingLevel: 1,
            selectedDeck: ['little'],
            maxStageCleared: 0
        };
        localStorage.setItem('kuma_wars_data', JSON.stringify(data));
        location.reload();
    """)
    page.wait_for_timeout(500)

    # 3. Upgrade Wallet (Max Money)
    print("Upgrading Wallet...")
    page.locator("#menu-powerup-btn").click()

    # Wait for rendering
    page.wait_for_timeout(500)

    # Buy Wallet (id='wallet')
    btn = page.locator("button[data-id='wallet']")
    expect(btn).to_be_visible()

    page.on("dialog", lambda dialog: dialog.accept())
    btn.click() # Lv 2
    page.wait_for_timeout(200)

    # 4. Upgrade Accounting
    print("Upgrading Accounting...")
    btn_acc = page.locator("button[data-id='accounting']")
    btn_acc.click() # Lv 2
    page.wait_for_timeout(200)

    # Back to Menu
    page.locator("#back-to-menu-from-powerup-btn").click()

    # 5. Start Battle and Verify Wallet Cap
    print("Starting Battle...")
    page.locator("#menu-start-btn").click()
    page.locator("button[data-stage='1']").click()

    # Default Max Money: 1000.
    # Wallet Lv 2 (+500): Base Max = 1500.
    # Worker Lv 1: +0.
    # Expected Max: 1500.
    money_display = page.locator("#money-display")
    expect(money_display).to_contain_text("/ 1500")
    print("Wallet Upgrade Verified: Max Money is 1500")

    # Screenshot
    page.screenshot(path="verification/powerup_new_verification.png")
    print("Screenshot saved.")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            test_new_powerups(page)
        except Exception as e:
            print(f"Test failed: {e}")
            page.screenshot(path="verification/powerup_new_error.png")
            raise e
        finally:
            browser.close()
