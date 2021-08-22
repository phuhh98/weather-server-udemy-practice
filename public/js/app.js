//client side js in public folder

console.log('client side javascript is loaded');

const weatherForm = document.querySelector('form');
const search = document.querySelector('input');
const messageOne = document.querySelector('#message-1');
const messageTwo = document.querySelector('#message-2');

messageOne.textContent = 'From JS';

weatherForm.addEventListener('submit', (event) => {
	event.preventDefault();
	const location = search.value;
	messageOne.textContent = 'Loading...';

	fetch(`/weather?address=${location}`)
		.then(async (response) => {
			let body = {};
			await response
				.json()
				.then((data) => {
					body = data;
				})
				.catch((err) => err);
			if (body.error) {
				messageOne.textContent = 'Done';
				return (messageTwo.textContent = body.error);
			}

			console.log(body);
			messageOne.textContent = body.location;
			messageTwo.innerHTML = body.forecastData;
		})
		.catch((err) => {
			messageTwo.textContent = err.message;
		});
});
