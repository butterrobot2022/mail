document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#inbox-view').style.display = 'none';
  
    
  inbox();
  // By default, load the inbox
  load_mailbox('Inbox');
});

let id = '';
let id2 = '';

const Contains = (arr, value) => {
  let doesContains;
  arr.forEach((item) => {
    if (item === value) {
      doesContains = true;
    }
  });
  return doesContains ? doesContains : false;
}


let readList = [];
let ids = []
let color = '';
let read = '';
let testIds = [];
let testColor = '';


function inbox() {
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#inbox-view').style.display = 'none';
  document.querySelector('#archive-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';
  fetch('/emails/inbox')
  .then(response => response.json())
  .then(emails => {
      // Print emails
      console.table(emails);
      emailLength = emails.length;
      const emailList = [];
      for (let i = 0; i < emailLength; i++){
        readList.push(emails[i].read);
        ids.push(emails[i].id)
        emailList.push(`<span class=${emails[i].id}><a class="my-link" href="/emails/${emails[i].id}">${emails[i].sender}</a>, ${emails[i].subject} ${emails[i].timestamp}.</span>`);
      }
      for (let j =0; j < emailLength; j++){
        const emailView = document.querySelector('#emails-view');
        const element = document.createElement('div');
        element.innerHTML = emailList[j];
        read = readList[j];

        if (read){
          // do nothing
        } else {
          element.className = 'unread';
        }
        element.style.border = '1px solid black';
        element.id = `inbox-${ids[j]}`;
        element.style.padding = '10px 10px';
        element.style.marginBottom = '10px';
        emailView.appendChild(element);
      };

      // emails.map((element) => {
      //     const container = document.createElement('div');
      //     container.style.border = '1px solid black';
      //     container.id = `inbox-${element.id}`;
      //     container.style.padding = '10px 10px';
      //     container.style.marginBottom = '10px';
      //     container.classList.add('my-link');
      //     container.innerHTML = `
      //       <a href="/emails/${element.id}"><span>${element.sender}</span></a>
      //       <span>${element.subject}</span>
      //       <span>${element.timestamp}</span>
      //     `;
          
      //     if (!element.read) {
      //       container.classList.add('unread');
      //     }

      //     document.querySelector('#emails-view').appendChild(container);
      // });
    });
    
    click();
}


function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#inbox-view').style.display = 'none';
  document.querySelector('#archive-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}


function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#inbox-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

};


function sent() {
  document.querySelector('#emails-view').style.display = 'block';
  fetch('/emails/sent')
.then(response => response.json())
.then(emails => {
    // Print email
    emailLength = emails.length;
    const emailList = [];
    for (let i = 0; i < emailLength; i++){
      emailList.push(`<span><b>${emails[i].sender}</b></span>, <span>${emails[i].subject}</span>, <span style='text-align: right;'>${emails[i].timestamp}</span>.`);
    }

    for (let j =0; j < emailLength; j++){
      const emailView = document.querySelector('#emails-view');
      const element = document.createElement('div');
      element.innerHTML = emailList[j];
      element.style.border = '1px solid black';
      element.style.padding = '10px 10px';
      element.style.marginBottom = '10px';
      emailView.appendChild(element);
    };

});
document.querySelector('#sent').onclick = sent;
}


function view() {
  try {
    console.log(id);
  if (document.querySelector('#emails-view').style.display == 'block') {
    const myLinks = document.querySelectorAll('.my-link');
    console.log(myLinks);
    for (let a = 0; a < myLinks.length; a++){

    const hrefValue = myLinks[a].getAttribute('href');

    myLinks[a].addEventListener('click', function(event) {
    event.preventDefault();
    fetch(`${hrefValue}`, {
        method: 'PUT',
        body: JSON.stringify({
            read: true
        })
      })
      fetch(`${hrefValue}`)
      .then(response => response.json())
      .then(email => {
          document.querySelector('#inbox-view').innerHTML =  '';
          document.querySelector('#emails-view').style.display = 'none';
          document.querySelector('#compose-view').style.display = 'none';
          document.querySelector('#inbox-view').style.display = 'block';
          document.querySelector('#archive-view').style.display = 'none';
          const Contains = (arr, value) => {
            let doesContains;
            arr.forEach((item) => {
              if (item === value) {
                doesContains = true;
              }
            });
            return doesContains ? doesContains : false;
          }
          const inboxView = document.querySelector('#inbox-view');
          const data = document.createElement('div');
          data.id = `${email.id}`;
          id2 = email.id;
          id = email.id;
          sender = email.sender;
          reciever = email.recipients;
          subject = email.subject;
          timestamp = email.timestamp;
          message = email.body;
          archived = email.archived;
          const read = email.read;
          if (archived === true){
              data.innerHTML = `<span id="${id}"><h6>From: ${sender}</h1> <h6>To: ${reciever}</h6><h6>Subject: ${subject}</h6>
              <h6>Timstamp: ${timestamp}</h6><button class="btn btn-sm btn-outline-primary" onclick="reply()">Reply</button><hr>${message}<br><br> 
              <button onclick ="unarchive()" class="btn btn-sm btn-primary" id="unarchive">Unarchive</button></span>`;
          } else {
            data.innerHTML = `<span id="${id}"><h6>From: ${sender}</h1> <h6>To: ${reciever}</h6><h6>Subject: ${subject}</h6>
            <h6>Timstamp: ${timestamp}</h6><button class="btn btn-sm btn-outline-primary" onclick="reply()">Reply</button><hr>${message}<br><br> 
            <button class="btn btn-sm btn-primary" id="archive" onclick="arch()">Archive</button></span>`;
          }
          inboxView.appendChild(data); 

      });
      // removeItem.remove();
      });

  }};
} catch(error) {

}

}

let list = [];
let idList = [];
let testList = []


function archive() {
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#inbox-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#archive-view').style.display = 'block';
  fetch('emails/archive')
.then(response => response.json())
.then(emails => {
    const len = emails.length
    const Contains = (arr, value) => {
      let doesContains;
      arr.forEach((item) => {
        if (item === value) {
          doesContains = true;
        }
      });
      return doesContains ? doesContains : false;
    }
    for (let j = 0; j < len; j++) {
      const item = `<span id="${emails[j].id}"><a href="emails/${emails[j].id}" class="my-link">${emails[j].sender}</a>, ${emails[j].subject} ${emails[j].timestamp}.</span`;
      const checks = Contains(list, item);
      if (checks) {
        // do nothing
      } else {
        list.push(item);
        idList.push(`${emails[j].id}`);
      }
    };
    for (let i = 0; i < list.length; i++) {
      const item = list[i];
      const verify = Contains(testList, item);

      const archiveView = document.getElementById('archive-view');
      const element = document.createElement('div');
      element.innerHTML = item;
      element.id = `delete/${idList[i]}`;
      element.style.border = '1px solid black';
      element.style.padding = '10px 10px';
      element.style.marginBottom = '10px';
      if (verify) {
        // do nothing
      } else {
        archiveView.appendChild(element);
      }
      testList.push(item); 
    }

  });

  click();
}




function unarchive() {
  document.querySelector('#inbox-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#archive-view').style.display = 'block';
  document.querySelector('#emails-view').style.display = 'block';
  fetch(`emails/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
        archived: false
    })
  })
    const getID = document.getElementById(`delete/${id}`);
    console.log(getID);
    getID.remove();
}


function reply() {
  fetch(`emails/${id}`)
  .then(response => response.json())
  .then(email => {
    console.log(email);
    document.querySelector('#emails-view').style.display = 'none';
    document.querySelector('#inbox-view').style.display = 'none';
    document.querySelector('#archive-view').style.display = 'none';
    document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
    document.querySelector('#compose-recipients').value = email.sender;
    document.querySelector('#compose-subject').value = `Re: ${email.subject}`;
    document.querySelector('#compose-body').value = `On ${email.timestamp}, ${email.sender} wrote: \n${email.body}`;
  });
  
}
   

function click() {
  const inboxView = document.querySelector('#inbox-view');
  inboxView.innerHTML = '';
  const run = setInterval(view, 100);
    setTimeout(() => {
      clearInterval(run);
}, 100);

}



function arch() { 
  document.querySelector('#inbox-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#archive-view').style.display = 'none';
  document.querySelector('#emails-view').style.display = 'block';
  fetch(`emails/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
    archived: true
    })
  });
  const getItem = document.getElementById(`inbox-${id}`);
  getItem.remove();
}



