

// Helper function for creating elements
function createElement(type, attrs, ...children) {
  const ele = document.createElement(type);
  for (const prop in attrs) {
    if (attrs.hasOwnProperty(prop)) {
      ele.setAttribute(prop, attrs[prop]);
    }
  }
  children.forEach(c => ele.appendChild(typeof c === 'string' ? document.createTextNode(c) : c));
  return ele;
}

// Function to toggle modal display
function toggleModal(modal, show) {
  if (typeof modal.showModal === "function" && typeof modal.close === "function") {
    show ? modal.showModal() : modal.close();
  } else {
    modal.style.display = show ? 'block' : 'none';
  }
}

document.addEventListener('DOMContentLoaded', function() {
  const mainElement = document.querySelector('main');
  const askButton = document.getElementById('btn-show-modal-question');
  const modalQuestion = document.getElementById('modal-question');
  const closeAskModal = document.querySelector('#modal-question .close');
  const submitQuestionButton = document.getElementById('create-question');
  const questionInput = document.getElementById('question-text');

  if (typeof HTMLDialogElement === 'function') {
    console.log('This browser supports <dialog> elements.');
  } else {
    console.log('This browser does not support <dialog> elements.');
  }

  // Fetch and display existing questions
  fetch('/questions/')
    .then(response => response.json())
    .then(data => {
      data.forEach(question => addQuestionToPage(question));
    })
    .catch(error => console.log('Fetch error:', error));

  // Event listeners for 'Ask a Question' modal
  askButton.addEventListener('click', function() {
    toggleModal(modalQuestion, true);
  });

  closeAskModal.addEventListener('click', function() {
    toggleModal(modalQuestion, false);
    questionInput.value = '';
  });

  console.log(askButton, modalQuestion, submitQuestionButton);

  askButton.addEventListener('click', function() {
    console.log('Ask button clicked'); // To verify event listener is working
    toggleModal(modalQuestion, true);
    questionInput.focus(); // Add focus to the input field when the modal is displayed
  });

  closeAskModal.addEventListener('click', function() {
    toggleModal(modalQuestion, false);
    questionInput.value = '';
  });

  // Submitting a new question
  submitQuestionButton.addEventListener('click', function() {
    const questionText = questionInput.value;
    fetch('/questions/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: questionText })
    })
    .then(response => response.json())
    .then(data => {
      if (data.error) {
        console.error('Error:', data.error);
      } else {
        addQuestionToPage(data);
        toggleModal(modalQuestion, false);
        questionInput.value = '';
      }
    })
    .catch(error => console.error('Error:', error));
  });
});


function addQuestionToPage(question) {
  const mainElement = document.querySelector('main');

  // Create elements for the question and the answers list
  const questionTextElement = createElement('h2', {}, question.question);
  const answersListElement = createElement('ul', { 'class': 'answers-list' });

  // Iterate over the answers and create an 'li' element for each
  question.answers.forEach(answer => {
    const answerElement = createElement('li', {}, answer);
    answersListElement.appendChild(answerElement);
  });

  // Create the 'Add Answer' button
  const answerButton = createElement('button', {
    'class': 'btn-add-answer',
    'data-question-id': question._id
  }, 'Add Answer');

  // Create the container div for the question block
  const questionElement = createElement('div', { 'id': question._id }, questionTextElement, answerButton, answersListElement);
  
  // Append the question block to the main element
  mainElement.appendChild(questionElement);
}








