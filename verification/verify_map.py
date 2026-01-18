import os
from playwright.sync_api import sync_playwright, expect

def verify_map(page):
    cwd = os.getcwd()
    file_path = f"file://{cwd}/index.html"
    print(f"Loading {file_path}")
    page.goto(file_path)

    # 1. Skip Intro
    intro = page.locator("#intro-screen")
    intro.click()
    page.wait_for_timeout(500)

    # 2. Go to Stage Select (Map)
    page.locator("#menu-start-btn").click()
    page.wait_for_timeout(500)

    # Verify Map Container
    map_container = page.locator("#map-container")
    expect(map_container).to_be_visible()

    # Check Regions
    kyushu = page.locator(".region-kyushu")
    expect(kyushu).to_be_visible()
    expect(kyushu).to_have_text("九州・沖縄")

    # 3. Open Region
    kyushu.click()
    page.wait_for_timeout(500)

    # Verify Stage List
    stage_list = page.locator("#stage-list-container")
    expect(stage_list).to_be_visible()
    expect(page.locator("#region-title")).to_have_text("九州・沖縄")

    # Screenshot Map Flow
    page.screenshot(path="verification/map_verification.png")

    # 4. Verify Battle UI Slots
    # Enter Stage 1
    page.locator("button[data-stage='1']").click()
    page.wait_for_timeout(1000)

    # Check Slots
    slots = page.locator("#controls .summon-btn")
    count = slots.count()
    print(f"Slot Count: {count}")

    if count != 10:
        raise Exception(f"Expected 10 slots, found {count}")

    # Check visuals (icon class)
    first_slot = slots.first
    expect(first_slot.locator(".btn-icon")).to_be_visible()
    expect(first_slot.locator(".btn-cost")).to_be_visible()

    # Screenshot Battle UI
    page.screenshot(path="verification/battle_ui_verification.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            verify_map(page)
        except Exception as e:
            print(f"Test failed: {e}")
            raise e
        finally:
            browser.close()