class Tasker {

	constructor() {
		this.taskInput = document.getElementById("input-task");
		this.addBtn = document.getElementById("add-task-btn");
		this.tasklist = document.getElementById("tasks");
		this.tasklistChildren = this.tasklist.children;
		this.errorMessage = document.getElementById("error");
		this.agreeButton = document.querySelector('.agree');
		this.cookieMessage = document.querySelector('.cookieMessage');
		this.infoBar = document.querySelector('.infoBar');
		this.loadUserData();
		this.taskInput.focus();
	}

	initialize() {
		this.bindEvents();
		this.evalTasklist();
	}

	bindEvents() {
		this.addBtn.onclick = (e) => {
			this.addTask();
		}
		this.taskInput.onkeypress = (e) => {
			if (e.key === 'Enter') {
				this.addTask();
			}
		}
		this.agreeButton.onclick = () => {
			this.cookieMessage.style.display = 'none';
			this.setCookie('agreedToCookies', true);
		}
	}

	addTask() {
		const value = this.taskInput.value;
		this.errorMessage.style.display = "none";

		if (value === "") {
			this.error();
		} else {
			this.render(this.taskInput.value);
			this.saveUserData();
			this.taskInput.value = "";
			this.evalTasklist();
		}
		this.taskInput.focus();
	}

	saveUserData() {
		const tasksArray = [...this.tasklistChildren].map(elem => ({ text: elem.innerText, finished: elem.querySelector('input[type=checkbox]').checked }))
		this.setCookie('tasks', tasksArray);
	}

	loadUserData() {
		const tasks = this.getCookie('tasks');
		if (tasks) {
			tasks.forEach(task => {
				this.render(task.text, task.finished);
			})
		}
		const agreedToCookies = this.getCookie('agreedToCookies');
		if (!agreedToCookies) {
			this.cookieMessage.style.display = 'block';
		}
	}

	setCookie(cname, cvalue, exdays = 100) {
		const d = new Date();
		d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
		let expires = "expires=" + d.toUTCString();
		document.cookie = cname + "=" + JSON.stringify(cvalue) + ";" + expires + ";path=/;SameSite=Lax";
	}

	getCookie(name) {
		const value = `; ${document.cookie}`;
		const parts = value.split(`; ${name}=`);
		if (parts.length === 2) return JSON.parse(parts.pop().split(';').shift());
	}

	evalTasklist() {
		let i, chkBox, delBtn;
		for (i = 0; i < this.tasklistChildren.length; i += 1) {
			chkBox = this.tasklistChildren[i].getElementsByTagName("input")[0];
			chkBox.onclick = this.completeTask.bind(this, this.tasklistChildren[i], chkBox);
			delBtn = this.tasklistChildren[i].getElementsByTagName("button")[0];
			delBtn.onclick = this.delTask.bind(this, i);
		}
	}

	render(taskText, taskFinished = false) {
		let taskLi, taskChkbx, taskVal, taskBtn, taskTrsh;
		taskLi = document.createElement("li");
		taskLi.setAttribute("class", "task");
		taskChkbx = document.createElement("input");
		taskChkbx.setAttribute("type", "checkbox");
		taskChkbx.checked = taskFinished;
		if (taskFinished) {
			taskLi.classList.add("completed");   
		}
		taskVal = document.createTextNode(taskText);
		taskBtn = document.createElement("button");
		taskTrsh = document.createElement("i");
		taskTrsh.setAttribute("class", "fa fa-trash");
		taskTrsh.style.cursor = "pointer";
		taskBtn.appendChild(taskTrsh);

		taskLi.appendChild(taskChkbx);
		taskLi.appendChild(taskVal);
		taskLi.appendChild(taskBtn);

		this.tasklist.appendChild(taskLi);
		this.updateTasks();
	}

	updateTasks() {
		const smartWord = this.tasklistChildren.length === 1 ? 'Task' : 'Tasks';
		this.infoBar.innerHTML = `${this.tasklistChildren.length} ${smartWord}`;
	}

	completeTask(i, chkBox) {
		if (chkBox.checked) {
			i.className = "task completed";
		} else {
			this.incompleteTask(i);
		}
		this.saveUserData();
	}

	incompleteTask(i) {
		i.className = "task";
	}


	delTask(i) {
		this.tasklist.children[i].remove();
		this.evalTasklist();
		this.saveUserData();
		this.updateTasks();
		this.taskInput.focus();
	}

	error() {
		this.errorMessage.style.display = "block";
	}
}

const t = new Tasker();
t.initialize();