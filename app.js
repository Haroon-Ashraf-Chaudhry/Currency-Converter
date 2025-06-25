const BASE_URL = "https://v6.exchangerate-api.com/v6/35790e83adf6c172a696646a/latest";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");
const amountInput = document.querySelector("#amount");

for (let select of dropdowns) {
  for (let currCode in countryList) {
    let option = document.createElement("option");
    option.value = currCode;
    option.innerText = currCode;

    if (select.name === "from" && currCode === "USD") 
      option.selected = true;
    if (select.name === "to" && currCode === "PKR") 
      option.selected = true;

    select.append(option);
  }

  select.addEventListener("change", (e) => updateFlag(e.target));
}

function updateFlag(el) {
  let code = el.value;
  let country = countryList[code];
  let img = el.parentElement.querySelector("img");
  img.src = `https://flagsapi.com/${country}/flat/64.png`;
}

async function updateExchangeRate() {
  let amount = parseFloat(amountInput.value);

  if (isNaN(amount) || amount <= 0) {
    amount = 1;
    amountInput.value = "1";
  }

  const from = fromCurr.value;
  const to = toCurr.value;

  try {
    const res = await fetch(`${BASE_URL}/${from}`);
    const data = await res.json();
    const rate = data.conversion_rates[to];

    const converted = (amount * rate).toFixed(2);
    msg.innerText = `${amount} ${from} = ${converted} ${to}`;
  } catch (err) {
    msg.innerText = "Could not fetch exchange rate.";
    console.error(err);
  }
}

btn.addEventListener("click", (e) => {
  e.preventDefault();
  updateExchangeRate();
});

window.addEventListener("load", () => {
  dropdowns.forEach((el) => updateFlag(el));
  updateExchangeRate();
});