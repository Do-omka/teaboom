// import { formatPrice } from '@/utils'

const formatPrice = new Intl.NumberFormat('ru-RU', {
	style: 'currency',
	currency: 'RUB',
}).format

// Можно выбирать элементы по data-
const inputs = document.querySelectorAll('.packaging__input')
const priceEl = document.getElementById('price')
const oldPriceEl = document.getElementById('old-price')
const articleEl = document.getElementById('article')
const amountEl = document.getElementById('amount')
const discountEl = document.getElementById('discount')

function setProductDetails(input) {
	const price = parseFloat(input.dataset.price)
	const oldPrice = parseFloat(input.dataset.oldPrice)
	const discount = Number(input.dataset.discount)

	priceEl.textContent = formatPrice(price)
	oldPriceEl.textContent = formatPrice(oldPrice)
	articleEl.textContent = input.dataset.article
	amountEl.textContent = input.dataset.amount

	oldPriceEl.hidden = !discount
	discountEl.hidden = !discount
	discountEl.textContent = discount ? '-' + discount + '%' : ''
}

inputs.forEach((input) => {
	input.addEventListener('change', () => setProductDetails(input))
})

const initial = document.querySelector('.packaging__input:checked')
if (initial) setProductDetails(initial)
