(function () {
  "use strict";

  // Made-up sample data: rough per-serving numbers, not exact nutrition facts.
  var MEALS = [
    { id: "chicken-rice", name: "Chicken and rice bowl", cal: 520, pro: 42,
      items: [["Chicken breast", 150, "g"], ["Cooked rice", 200, "g"], ["Broccoli", 100, "g"]] },
    { id: "egg-toast", name: "Egg scramble with toast", cal: 400, pro: 28,
      items: [["Eggs", 3, "count"], ["Whole-wheat bread", 2, "slices"], ["Spinach", 30, "g"]] },
    { id: "yogurt-parfait", name: "Greek yogurt parfait", cal: 330, pro: 25,
      items: [["Greek yogurt", 250, "g"], ["Rolled oats", 40, "g"], ["Blueberries", 80, "g"]] },
    { id: "turkey-chili", name: "Turkey chili", cal: 450, pro: 38,
      items: [["Ground turkey", 150, "g"], ["Canned beans", 120, "g"], ["Canned tomatoes", 150, "g"]] },
    { id: "salmon-potato", name: "Salmon, potato and green beans", cal: 600, pro: 40,
      items: [["Salmon fillet", 150, "g"], ["Potato", 250, "g"], ["Green beans", 100, "g"]] },
    { id: "pb-oats", name: "Peanut butter banana oats", cal: 480, pro: 18,
      items: [["Rolled oats", 60, "g"], ["Banana", 1, "count"], ["Peanut butter", 2, "tbsp"]] },
    { id: "tuna-wrap", name: "Tuna wrap", cal: 380, pro: 32,
      items: [["Canned tuna", 1, "can"], ["Tortilla", 1, "count"], ["Lettuce", 30, "g"]] },
    { id: "beef-stirfry", name: "Beef stir-fry with rice", cal: 550, pro: 40,
      items: [["Beef strips", 150, "g"], ["Cooked rice", 200, "g"], ["Mixed vegetables", 150, "g"]] },
    { id: "cottage-fruit", name: "Cottage cheese and pineapple", cal: 250, pro: 24,
      items: [["Cottage cheese", 200, "g"], ["Pineapple", 100, "g"]] },
    { id: "tofu-bowl", name: "Veggie tofu bowl", cal: 470, pro: 30,
      items: [["Firm tofu", 180, "g"], ["Cooked rice", 200, "g"], ["Broccoli", 100, "g"]] }
  ];

  var MAX_SERVINGS = 9;
  var servings = {};
  var calTarget = 2800;
  var proTarget = 180;

  var mealList = document.getElementById("meal-list");
  var calText = document.getElementById("cal-text");
  var proText = document.getElementById("pro-text");
  var calBar = document.getElementById("cal-bar");
  var proBar = document.getElementById("pro-bar");
  var targetForm = document.getElementById("target-form");
  var calInput = document.getElementById("cal-target");
  var proInput = document.getElementById("pro-target");
  var targetMessage = document.getElementById("target-message");
  var groceryMessage = document.getElementById("grocery-message");
  var groceryList = document.getElementById("grocery-list");

  function setMessage(el, text, kind) {
    el.textContent = text;
    el.className = "message " + (kind || "");
  }

  function getServings(id) { return servings[id] || 0; }

  function totals() {
    var cal = 0, pro = 0;
    MEALS.forEach(function (m) {
      var s = getServings(m.id);
      cal += m.cal * s;
      pro += m.pro * s;
    });
    return { cal: cal, pro: pro };
  }

  function renderTotals() {
    var t = totals();
    calText.textContent = "Calories: " + t.cal.toLocaleString() + " of " + calTarget.toLocaleString() + " target (" +
      Math.round((t.cal / calTarget) * 100) + "%)";
    proText.textContent = "Protein: " + t.pro + " g of " + proTarget + " g target (" +
      Math.round((t.pro / proTarget) * 100) + "%)";
    calBar.value = Math.min(100, Math.round((t.cal / calTarget) * 100));
    proBar.value = Math.min(100, Math.round((t.pro / proTarget) * 100));
  }

  function changeServings(id, delta) {
    var next = getServings(id) + delta;
    if (next < 0 || next > MAX_SERVINGS) { return; }
    servings[id] = next;
    var out = document.getElementById("count-" + id);
    if (out) { out.textContent = next; }
    renderTotals();
  }

  function renderMeals() {
    mealList.innerHTML = "";
    MEALS.forEach(function (m) {
      var li = document.createElement("li");

      var info = document.createElement("span");
      info.className = "meal-info";
      info.textContent = m.name + " (" + m.cal + " cal, " + m.pro + " g protein)";

      var controls = document.createElement("span");
      controls.className = "meal-controls";

      var minus = document.createElement("button");
      minus.type = "button";
      minus.className = "secondary";
      minus.textContent = "-";
      minus.setAttribute("aria-label", "Remove one serving of " + m.name);
      minus.addEventListener("click", function () { changeServings(m.id, -1); });

      var count = document.createElement("span");
      count.id = "count-" + m.id;
      count.className = "count";
      count.textContent = getServings(m.id);
      count.setAttribute("aria-label", "Servings of " + m.name);

      var plus = document.createElement("button");
      plus.type = "button";
      plus.className = "secondary";
      plus.textContent = "+";
      plus.setAttribute("aria-label", "Add one serving of " + m.name);
      plus.addEventListener("click", function () { changeServings(m.id, 1); });

      controls.appendChild(minus);
      controls.appendChild(count);
      controls.appendChild(plus);
      li.appendChild(info);
      li.appendChild(controls);
      mealList.appendChild(li);
    });
  }

  // Combine ingredients across chosen meals, multiplied by servings.
  function buildGrocery() {
    var combined = {};
    MEALS.forEach(function (m) {
      var s = getServings(m.id);
      if (!s) { return; }
      m.items.forEach(function (it) {
        var key = it[0] + "|" + it[2];
        combined[key] = (combined[key] || 0) + it[1] * s;
      });
    });
    return Object.keys(combined).sort().map(function (key) {
      var parts = key.split("|");
      return { name: parts[0], amount: combined[key], unit: parts[1] };
    });
  }

  function renderGrocery() {
    groceryList.innerHTML = "";
    var items = buildGrocery();
    if (!items.length) {
      setMessage(groceryMessage, "Pick at least one meal first.", "error");
      return;
    }
    setMessage(groceryMessage, items.length + " items for your plan.", "ok");
    items.forEach(function (it, i) {
      var li = document.createElement("li");
      var box = document.createElement("input");
      box.type = "checkbox";
      box.id = "g-" + i;
      var label = document.createElement("label");
      label.setAttribute("for", box.id);
      label.className = "inline-label";
      label.textContent = it.name + ": " + it.amount + " " + it.unit;
      li.appendChild(box);
      li.appendChild(label);
      groceryList.appendChild(li);
    });
  }

  targetForm.addEventListener("submit", function (e) {
    e.preventDefault();
    var cal = Number(calInput.value);
    var pro = Number(proInput.value);
    if (!calInput.value || !Number.isFinite(cal) || cal < 1200 || cal > 6000) {
      setMessage(targetMessage, "Calories must be a number from 1200 to 6000.", "error");
      calInput.focus();
      return;
    }
    if (!proInput.value || !Number.isFinite(pro) || pro < 20 || pro > 400) {
      setMessage(targetMessage, "Protein must be a number from 20 to 400 grams.", "error");
      proInput.focus();
      return;
    }
    calTarget = Math.round(cal);
    proTarget = Math.round(pro);
    setMessage(targetMessage, "Targets updated.", "ok");
    renderTotals();
  });

  document.getElementById("make-list").addEventListener("click", renderGrocery);

  document.getElementById("clear-meals").addEventListener("click", function () {
    servings = {};
    renderMeals();
    renderTotals();
    groceryList.innerHTML = "";
    setMessage(groceryMessage, "", "");
  });

  renderMeals();
  renderTotals();
})();
