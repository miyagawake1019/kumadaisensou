import os
from playwright.sync_api import sync_playwright, expect

def test_rare_orb(page):
    cwd = os.getcwd()
    file_path = f"file://{cwd}/index.html"
    print(f"Loading {file_path}")
    page.goto(file_path)

    # 1. Reset Game
    page.evaluate("localStorage.clear(); location.reload();")
    page.wait_for_timeout(500)

    # 2. Hack Data: Give Orbs
    print("Hacking data (5 Orbs)...")
    page.evaluate("""
        const data = {
            coins: 1000,
            unlockedUnits: ['little'],
            unitLevels: { 'little': 1 },
            rareOrbs: 5,
            maxStageCleared: 0
        };
        localStorage.setItem('kuma_wars_data', JSON.stringify(data));
        location.reload();
    """)
    page.wait_for_timeout(500)

    # 3. Check Orb UI
    orb_el = page.locator("#player-orbs")
    expect(orb_el).to_have_text("5")
    print("Orb Count Verified: 5")

    # 4. Open Zukan
    print("Opening Zukan...")
    page.locator("#menu-zukan-btn").click()

    # 5. Upgrade with Orb
    # We need to handle the Prompt dialog.
    # We want to select option "2".

    def handle_dialog(dialog):
        print(f"Dialog message: {dialog.message}")
        if "番号を入力してください" in dialog.message: # "Enter number"
            dialog.accept("2") # Select Orb
        elif "レア玉を使ってレベルアップ" in dialog.message: # Success message
            dialog.accept()
        else:
            dialog.dismiss()

    page.on("dialog", handle_dialog)

    # Click Little Bear
    little_bear = page.locator(".zukan-item").first
    print("Clicking unit to upgrade...")
    little_bear.click()

    page.wait_for_timeout(500)

    # 6. Verify Level Up and Orb Deduction
    # Level should be 2
    expect(little_bear).to_contain_text("Lv.2")
    print("Unit Level Up Verified: Lv.2")

    # Orb count in header (might need refresh or just check DOM)
    expect(orb_el).to_have_text("4")
    print("Orb Count Deducted: 4")

    # Screenshot
    page.screenshot(path="verification/orb_verification.png")
    print("Screenshot saved.")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            test_rare_orb(page)
        except Exception as e:
            print(f"Test failed: {e}")
            page.screenshot(path="verification/orb_error.png")
            raise e
        finally:
            browser.close()
