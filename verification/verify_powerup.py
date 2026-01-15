import os
from playwright.sync_api import sync_playwright, expect

def test_powerups(page):
    cwd = os.getcwd()
    file_path = f"file://{cwd}/index.html"
    print(f"Loading {file_path}")
    page.goto(file_path)

    # 1. Reset Game
    print("Resetting game...")
    page.evaluate("localStorage.clear(); location.reload();")
    page.wait_for_timeout(500)

    # 2. Hack Data: Give Coins
    print("Hacking data (10000 coins)...")
    page.evaluate("""
        const data = {
            coins: 10000,
            unlockedUnits: ['little'],
            unitLevels: { 'little': 1 },
            baseHpLevel: 1,
            selectedDeck: ['little'],
            maxStageCleared: 0
        };
        localStorage.setItem('kuma_wars_data', JSON.stringify(data));
        location.reload();
    """)
    page.wait_for_timeout(500)

    # 3. Check Initial HP (Level 1 = 1000)
    print("Checking Initial HP in Battle...")
    page.locator("#menu-start-btn").click()
    page.locator("button[data-stage='1']").click()
    expect(page.locator("#player-base-hp")).to_have_text("1000")
    print("Initial HP Verified: 1000")

    # Retreat
    page.locator("#back-to-select-btn").click()
    page.locator("#back-to-menu-btn").click()

    # 4. Open Power Up Screen
    print("Opening Power Up Screen...")
    page.locator("#menu-powerup-btn").click()

    # 5. Buy HP Upgrade
    hp_btn = page.locator("button[data-id='baseHp']")
    # Cost for Lv1 -> Lv2 is 2000. We have 10000.

    print("Buying Base HP Upgrade...")
    page.on("dialog", lambda dialog: dialog.accept()) # Confirm purchase
    hp_btn.click()

    page.wait_for_timeout(500)

    # Verify Level Update in UI
    # Text should say Lv.2
    # Parent div of button -> previous sibling -> .powerup-name?
    # Actually just check if any element contains "Lv.2" near "Base HP"
    expect(page.locator(".powerup-name").filter(has_text="Base HP")).to_contain_text("Lv.2")
    print("UI shows Base HP Lv.2")

    # 6. Verify Effect in Battle (Level 2 = 2000 HP)
    print("Checking Upgraded HP in Battle...")
    page.locator("#back-to-menu-from-powerup-btn").click()
    page.locator("#menu-start-btn").click()
    page.locator("button[data-stage='1']").click()

    expect(page.locator("#player-base-hp")).to_have_text("2000")
    print("Upgraded HP Verified: 2000")

    # Screenshot
    page.screenshot(path="verification/powerup_verification.png")
    print("Screenshot saved.")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            test_powerups(page)
        except Exception as e:
            print(f"Test failed: {e}")
            page.screenshot(path="verification/powerup_error.png")
            raise e
        finally:
            browser.close()
