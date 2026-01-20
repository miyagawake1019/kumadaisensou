import os
from playwright.sync_api import sync_playwright, expect

def verify_visuals(page):
    cwd = os.getcwd()
    file_path = f"file://{cwd}/index.html"
    print(f"Loading {file_path}")
    page.goto(file_path)

    # 1. Skip Intro
    intro = page.locator("#intro-screen")
    intro.click()
    page.wait_for_timeout(500)

    # 2. Start Game
    page.locator("#menu-start-btn").click()
    page.wait_for_timeout(500)

    # Select Region -> Stage
    page.locator(".region-kyushu").click()
    page.wait_for_timeout(500)
    page.locator("button[data-stage='1']").click()
    page.wait_for_timeout(1000)

    # 3. Spawn Unit for Shadow Check
    page.evaluate("window.debugGame.spawnUnit('little', 'player')")

    # 4. Check Background & Shadows
    # (Visual check mostly via screenshot)
    page.screenshot(path="verification/visual_realism.png")

    # 5. Check Particle Spawning
    print("Spawning Particles...")
    page.evaluate("window.debugGame.gameState.units[0].hp -= 10;") # Trigger damage logic? No, damage logic is inside resolveCombat loop.
    # Force spawn function directly
    page.evaluate("window.debugGame.visualizeBaseDamage('player')")
    page.wait_for_timeout(100) # Wait for animation

    # Check if particles exist
    particles = page.locator(".particle")
    count = particles.count()
    print(f"Particle Count: {count}")

    if count == 0:
        raise Exception("Particles did not spawn")

    page.screenshot(path="verification/visual_particles.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            verify_visuals(page)
        except Exception as e:
            print(f"Test failed: {e}")
            raise e
        finally:
            browser.close()