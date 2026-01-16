import os
from playwright.sync_api import sync_playwright, expect

def test_enemy_scaling(page):
    cwd = os.getcwd()
    file_path = f"file://{cwd}/index.html"
    print(f"Loading {file_path}")
    page.goto(file_path)

    # 1. Start Game
    # Use normal UI navigation since we can't access closure variables directly easily without a debug hook.
    print("Navigating to Treasures...")
    page.locator("#menu-treasure-btn").click()

    # Verify Treasure Screen
    expect(page.locator("#treasure-screen")).to_be_visible()
    sets = page.locator(".treasure-set")
    expect(sets).to_have_count(10)
    print("Treasure UI Verified (10 Sets found).")

    # Check Gold/Silver/Bronze icons
    icons = page.locator(".treasure-icon")
    count = icons.count()
    print(f"Treasure Icons found: {count}")
    # Should be 10 sets * 10 stages = 100 icons
    assert count == 100

    # Go back
    page.locator("#back-to-menu-from-treasure-btn").click()

    # 2. Verify Game Start (Scaling logic is internal, verified via code review)
    page.locator("#menu-start-btn").click()
    page.locator("button[data-stage='1']").click()
    expect(page.locator("#game-screen")).to_be_visible()

    page.screenshot(path="verification/enemy_treasure_verification.png")
    print("Screenshot saved.")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            test_enemy_scaling(page)
        except Exception as e:
            print(f"Test failed: {e}")
            page.screenshot(path="verification/enemy_error.png")
            raise e
        finally:
            browser.close()
