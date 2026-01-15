import os
from playwright.sync_api import sync_playwright, expect

def test_game_mechanics(page):
    # Load the game
    cwd = os.getcwd()
    file_path = f"file://{cwd}/index.html"
    print(f"Loading {file_path}")
    page.goto(file_path)

    # Click Battle (Start)
    print("Clicking Start...")
    page.get_by_role("button", name="出撃 (Battle)").click()

    # Select Stage 1
    print("Clicking Stage 1...")
    page.get_by_role("button", name="ステージ 1:").first.click()

    # Wait for game screen
    print("Waiting for game screen...")
    expect(page.locator("#game-screen")).to_be_visible()

    # Check System Buttons
    worker_btn = page.locator("#upgrade-worker-btn")
    cannon_btn = page.locator("#fire-cannon-btn")

    expect(worker_btn).to_be_visible()
    expect(cannon_btn).to_be_visible()

    print("Buttons visible.")

    # Money fills up fast, so Worker button should be enabled quickly.
    # Wait for it to be enabled.
    # Note: disabled attribute is boolean.

    # Let's wait a bit for money to fill
    page.wait_for_timeout(500)

    # Check text contains level 1
    expect(worker_btn).to_contain_text("Lv.1")

    # Click Upgrade
    print("Clicking Upgrade Worker...")
    worker_btn.click()

    # Check text contains level 2
    expect(worker_btn).to_contain_text("Lv.2")
    print("Worker upgraded to Lv.2")

    # Check Max Money increased (was 1000, now 2000)
    # The money display shows "Current / Max"
    money_display = page.locator("#money-display")
    expect(money_display).to_contain_text("/ 2000")
    print("Max money increased.")

    # Check Cannon Charge
    # It charges 0.5 per frame (approx 30fps) -> 15% per second.
    # We waited 500ms above + some execution time.
    expect(cannon_btn).to_contain_text("%")

    # Take screenshot
    page.screenshot(path="verification/verification.png")
    print("Screenshot saved to verification/verification.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            test_game_mechanics(page)
        except Exception as e:
            print(f"Test failed: {e}")
            page.screenshot(path="verification/error.png")
            raise e
        finally:
            browser.close()
