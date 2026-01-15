import os
from playwright.sync_api import sync_playwright, expect

def test_upgrade_and_meatshields(page):
    cwd = os.getcwd()
    file_path = f"file://{cwd}/index.html"
    print(f"Loading {file_path}")
    page.goto(file_path)

    # 1. Reset Game
    print("Resetting game...")
    page.evaluate("localStorage.clear(); location.reload();")
    page.wait_for_timeout(500)

    # 2. Hack Data: Unlock Tofu and Give Coins
    print("Hacking data...")
    page.evaluate("""
        const data = {
            coins: 10000,
            unlockedUnits: ['little', 'tofu_kuma'],
            unitLevels: { 'little': 1, 'tofu_kuma': 1 },
            selectedDeck: ['tofu_kuma'],
            maxStageCleared: 0
        };
        localStorage.setItem('kuma_wars_data', JSON.stringify(data));
        location.reload();
    """)
    page.wait_for_timeout(500)

    # 3. Test Upgrade in Zukan
    print("Opening Zukan...")
    page.locator("#menu-zukan-btn").click()

    # Find Little Bear
    little_bear = page.locator(".zukan-item").first # Should be little bear
    expect(little_bear).to_contain_text("Lv.1")

    # Click to Upgrade
    print("Upgrading Little Bear...")
    page.on("dialog", lambda dialog: dialog.accept()) # Accept confirmation
    little_bear.click()

    # Wait for update
    page.wait_for_timeout(500)

    # Verify Level 2
    expect(little_bear).to_contain_text("Lv.2")
    print("Little Bear upgraded to Lv.2")

    # Go back
    page.locator("#back-to-menu-from-zukan-btn").click()

    # 4. Test Tofu Bear Summon
    print("Starting Battle...")
    page.locator("#menu-start-btn").click()
    page.locator("button[data-stage='1']").click()

    # Wait for Tofu Button
    tofu_btn = page.locator("button[data-type='tofu_kuma']")
    expect(tofu_btn).to_be_visible()

    # Summon
    # Cost is 10, should be instant
    print("Summoning Tofu Bear...")
    # Wait a bit for money tick (30ms interval)
    page.wait_for_timeout(100)
    tofu_btn.click(force=True)

    # Verify Unit
    unit = page.locator(".unit[data-type='tofu_kuma']")
    expect(unit).to_be_visible()
    print("Tofu Bear summoned!")

    # Screenshot
    page.wait_for_timeout(500)
    page.screenshot(path="verification/upgrade_verification.png")
    print("Screenshot saved.")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            test_upgrade_and_meatshields(page)
        except Exception as e:
            print(f"Test failed: {e}")
            page.screenshot(path="verification/upgrade_error.png")
            raise e
        finally:
            browser.close()
