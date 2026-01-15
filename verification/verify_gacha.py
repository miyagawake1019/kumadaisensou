import os
from playwright.sync_api import sync_playwright, expect

def test_gacha_tickets(page):
    cwd = os.getcwd()
    file_path = f"file://{cwd}/index.html"
    print(f"Loading {file_path}")
    page.goto(file_path)

    # 1. Reset Game to ensure clean state
    # But Reset logic gives 5 normal, 1 rare. That's good.
    page.evaluate("localStorage.clear()")
    page.reload()

    # Check Reset Button Logic (re-initialize)
    page.locator("#reset-all-btn").click()
    page.on("dialog", lambda dialog: dialog.accept())
    page.wait_for_timeout(500) # Wait for reload

    # 2. Check Initial Tickets
    # Default is 5 Normal, 1 Rare
    normal_display = page.locator("#player-normal-tickets")
    rare_display = page.locator("#player-rare-tickets")

    expect(normal_display).to_have_text("5")
    expect(rare_display).to_have_text("1")
    print("Initial tickets verified: 5 Normal, 1 Rare")

    # 3. Go to Gacha Screen
    page.locator("#menu-gacha-btn").click()
    expect(page.locator("#gacha-screen")).to_be_visible()

    # 4. Pull Normal Gacha
    print("Pulling Normal Gacha...")
    page.locator("#pull-gacha-btn").click()

    # Expect count to drop to 4
    expect(normal_display).to_have_text("4")
    print("Normal Ticket deducted. (Remaining: 4)")

    # Check Result (Should be non-empty)
    result_icon = page.locator("#gacha-result").inner_text()
    print(f"Normal Gacha Result: {result_icon}")

    # 5. Pull Rare Gacha
    print("Pulling Rare Gacha...")
    page.locator("#pull-rare-gacha-btn").click()

    # Expect count to drop to 0
    expect(rare_display).to_have_text("0")
    print("Rare Ticket deducted. (Remaining: 0)")

    # Check Result (Likely Strong)
    result_icon_rare = page.locator("#gacha-result").inner_text()
    print(f"Rare Gacha Result: {result_icon_rare}")

    # 6. Try Pulling Again (Should fail/message)
    print("Trying to pull Rare Gacha with 0 tickets...")
    page.locator("#pull-rare-gacha-btn").click()

    msg = page.locator("#gacha-message")
    expect(msg).to_contain_text("足りません") # "Not enough"
    print("Correctly blocked with 0 tickets.")

    # Take screenshot
    page.screenshot(path="verification/gacha_verification.png")
    print("Screenshot saved.")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            test_gacha_tickets(page)
        except Exception as e:
            print(f"Test failed: {e}")
            page.screenshot(path="verification/gacha_error.png")
            raise e
        finally:
            browser.close()
