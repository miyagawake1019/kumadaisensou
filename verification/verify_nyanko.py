import os
from playwright.sync_api import sync_playwright, expect

def test_nyanko_units(page):
    cwd = os.getcwd()
    file_path = f"file://{cwd}/index.html"
    print(f"Loading {file_path}")
    page.goto(file_path)

    # 1. Start Game
    page.locator("#menu-start-btn").click()
    page.locator("button[data-stage='1']").click()
    expect(page.locator("#game-screen")).to_be_visible()

    # 2. Hack Unlock & Summon (Hack localStorage directly and reload)
    print("Unlocking Tank Bear via localStorage hack...")
    page.evaluate("""
        const data = JSON.parse(localStorage.getItem('kuma_wars_data') || '{}');
        if (!data.unlockedUnits) data.unlockedUnits = ['little'];
        if (!data.unlockedUnits.includes('tank_kuma')) {
            data.unlockedUnits.push('tank_kuma');
        }
        data.selectedDeck = ['tank_kuma'];
        localStorage.setItem('kuma_wars_data', JSON.stringify(data));
        location.reload();
    """)

    # Wait for reload
    page.wait_for_timeout(500)

    # 3. Start Game Again
    page.locator("#menu-start-btn").click()
    page.locator("button[data-stage='1']").click()
    expect(page.locator("#game-screen")).to_be_visible()

    # 4. Give Money
    # Now we need to access gameState. But it's inside a closure in game.js.
    # We can't access it directly from window.
    # However, we can just wait for money to accumulate (speed is high).
    # Tank Bear cost is 150. Initial money is 0?
    # No, we start with 0 money, but it goes up fast.
    # Wait for button to be enabled.

    print("Waiting for money...")
    btn = page.locator("button[data-type='tank_kuma']")
    expect(btn).to_be_visible()

    # Wait until not disabled
    # Opacity is used for visual, disabled attribute for logic.
    # Check style opacity or disabled attribute.
    # game.js sets btn.style.opacity = '1' when affordable.
    expect(btn).to_have_css("opacity", "1", timeout=10000)

    print("Money ready. Summoning...")
    btn.click()

    # 5. Verify Unit on Field
    unit = page.locator(".unit[data-type='tank_kuma']")
    expect(unit).to_be_visible()
    print("Tank Bear summoned!")

    # 6. Check for Pseudo Element (Bear Mark)
    content = unit.evaluate("el => window.getComputedStyle(el, '::after').content")
    print(f"Bear Mark Content: {content}")
    assert '🐻' in content or '\\"🐻\\"' in content or '"🐻"' in content

    # Screenshot
    page.wait_for_timeout(500)
    page.screenshot(path="verification/nyanko_verification.png")
    print("Screenshot saved.")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            test_nyanko_units(page)
        except Exception as e:
            print(f"Test failed: {e}")
            page.screenshot(path="verification/nyanko_error.png")
            raise e
        finally:
            browser.close()
