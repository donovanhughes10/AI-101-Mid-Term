# Test Log

Run every test on the **live GitHub Pages site** (private window), not on your computer. Fill in the Actual and Result columns with what really happened. Do not copy the Expected column.

Live URL tested: ____________________  Date/time: ____________________  Browser/device: ____________________

## Test 1: Normal input
- **Steps:** Leave targets at 2800 cal and 180 g. Add 1 serving of "Chicken and rice bowl" and 2 servings of "Greek yogurt parfait". Press Generate grocery list.
- **Expected:** Totals read 1,180 calories (42%) and 92 g protein (51%). Grocery list shows Chicken breast 150 g, Cooked rice 200 g, Broccoli 100 g, Greek yogurt 500 g, Rolled oats 80 g, Blueberries 160 g.
- **Actual:** 
- **Result (Pass/Fail):** 

## Test 2: Empty / invalid input
- **Steps:** Clear the calorie box and press Update targets. Then enter 500 calories. Then 8000. Then a valid calorie value with protein 5. Then press Generate grocery list with no meals chosen.
- **Expected:** A clear error message each time and targets do not change. The grocery list says to pick at least one meal.
- **Actual:** 
- **Result (Pass/Fail):** 

## Test 3: Repeated use
- **Steps:** Press + on one meal 10 times, then - many times. Generate the list, change servings, and generate again. Press Clear all meals.
- **Expected:** Servings stop at 9 and never go below 0. The list updates to match the new servings with no duplicate items. Clear all resets servings, totals and list.
- **Actual:** 
- **Result (Pass/Fail):** 

## Test 4: Keyboard access
- **Steps:** Using only Tab, Shift+Tab, Enter and Space: update targets, add meals, generate the list, tick an item.
- **Expected:** Every control is reachable and works, with a visible focus outline.
- **Actual:** 
- **Result (Pass/Fail):** 

## Test 5: Narrow screen
- **Steps:** Open the live site on your phone (or a window about 360px wide) and use both features.
- **Expected:** No sideways scrolling, text readable, + and - buttons easy to tap.
- **Actual:** 
- **Result (Pass/Fail):** 

## One fix and retest
- **Problem found:** 
- **What I changed:** 
- **Retest result:** 

## Fact check
Sample nutrition numbers are made up. Compare at least two meals to a nutrition label or database (for example, USDA FoodData Central) and note how far off they are: ____________________
