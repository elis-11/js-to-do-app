(function() {
	const tasker = {
		init: function() {
			this.defineElements();
			this.bindEvents();
			this.evalTasklist();
		},
		defineElements: function() {
			this.taskInput = document.getElementById("input-task");
			this.addBtn = document.getElementById("add-task-btn");
			this.tasklist = document.getElementById("tasks");
			this.tasklistChildren = this.tasklist.children;
			this.errorMessage = document.getElementById("error");
		},
		bindEvents: function() {
			this.addBtn.onclick = this.addTask.bind(this);
			this.taskInput.onkeypress = this.enterKey.bind(this);
		},
		evalTasklist: function() {
			let i, chkBox, delBtn;
			for (i = 0; i < this.tasklistChildren.length; i += 1) {
				chkBox = this.tasklistChildren[i].getElementsByTagName("input")[0];
				chkBox.onclick = this.completeTask.bind(this, this.tasklistChildren[i], chkBox);
				delBtn = this.tasklistChildren[i].getElementsByTagName("button")[0];
				delBtn.onclick = this.delTask.bind(this, i);
			}
		},
		render: function() {
			let taskLi, taskChkbx, taskVal, taskBtn, taskTrsh;
			taskLi = document.createElement("li");
			taskLi.setAttribute("class", "task");
			taskChkbx = document.createElement("input");
			taskChkbx.setAttribute("type", "checkbox");
			taskVal = document.createTextNode(this.taskInput.value);
			taskBtn = document.createElement("button");
			taskTrsh = document.createElement("i");
			taskTrsh.setAttribute("class", "fa fa-trash");
			taskTrsh.style.cursor = "pointer";
			taskBtn.appendChild(taskTrsh);

			taskLi.appendChild(taskChkbx);
			taskLi.appendChild(taskVal);
			taskLi.appendChild(taskBtn);

			this.tasklist.appendChild(taskLi);

		},
		completeTask: function(i, chkBox) {
			if (chkBox.checked) {
				i.className = "task completed";
			} else {
				this.incompleteTask(i);
			}
		},
		incompleteTask: function(i) {
			i.className = "task";
		},
		enterKey: function(event) {
			if (event.keyCode === 13 || event.which === 13) {
				this.addTask();
			}
		},
		addTask: function() {
			const value = this.taskInput.value;
			this.errorMessage.style.display = "none";

			if (value === "") {
				this.error();
			} else {
				this.render();
				this.taskInput.value = "";
				this.evalTasklist();
			}
		},
		delTask: function(i) {
			this.tasklist.children[i].remove();
			this.evalTasklist();
		},
		error: function() {
			this.errorMessage.style.display = "block";
		}
	};

	tasker.init();
}());