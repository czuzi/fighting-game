const canvas = document.querySelector("canvas")
const c = canvas.getContext("2d")

canvas.width = 1024
canvas.height = 576

c.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.5

class Sprite {
	constructor({ position, velocity, color, offset }) {
		this.position = position
		this.velocity = velocity
		this.width = 50
		this.height = 150
		this.lastKey
		this.attackBox = {
			position: {
				x: this.position.x,
				y: this.position.y,
			},
			offset: offset,
			width: 100,
			height: 50,
		}
		this.color = color
		this.isAttacking
		this.health = 100
	}

	draw() {
		c.fillStyle = this.color
		c.fillRect(this.position.x, this.position.y, this.width, this.height)

		//attack box
		if (this.isAttacking) {
			c.fillStyle = "yellow"
			c.fillRect(
				this.attackBox.position.x,
				this.attackBox.position.y,
				this.attackBox.width,
				this.attackBox.height
			)
		}
	}

	update() {
		this.draw()
		this.attackBox.position.x = this.position.x - this.attackBox.offset.x
		this.attackBox.position.y = this.position.y

		this.position.x += this.velocity.x
		this.position.y += this.velocity.y

		if (this.position.y + this.height + this.velocity.y >= canvas.height) {
			this.velocity.y = 0
		} else {
			this.velocity.y += gravity
		}
	}

	attack() {
		this.isAttacking = true
		setTimeout(() => {
			this.isAttacking = false
		}, 100)
	}
}

const player = new Sprite({
	position: {
		x: 0,
		y: 0,
	},
	velocity: {
		x: 0,
		y: 0,
	},
	color: "blue",
	offset: {
		x: 0,
		y: 0,
	},
})

const enemy = new Sprite({
	position: {
		x: 400,
		y: 100,
	},
	velocity: {
		x: 0,
		y: 0,
	},
	color: "red",
	offset: {
		x: 50,
		y: 0,
	},
})

const keys = {
	a: {
		pressed: false,
	},
	d: {
		pressed: false,
	},
	ArrowRight: {
		pressed: false,
	},
	ArrowLeft: {
		pressed: false,
	},
}

function hitDetection({ player1, player2 }) {
	return (
		player1.attackBox.position.x + player1.attackBox.width >=
			player2.position.x &&
		player1.attackBox.position.x <= player2.position.x + player2.width &&
		player1.attackBox.position.y + player1.attackBox.height >=
			player2.position.y &&
		player1.attackBox.position.y <= player2.position.y + player2.height
	)
}

function animate() {
	window.requestAnimationFrame(animate)
	c.fillStyle = "black"
	c.fillRect(0, 0, canvas.width, canvas.height)
	player.update()
	enemy.update()

	player.velocity.x = 0
	enemy.velocity.x = 0

	//player movements
	if (keys.a.pressed && player.lastKey === "a") {
		player.velocity.x = -5
	} else if (keys.d.pressed && player.lastKey === "d") {
		player.velocity.x = 5
	}

	//enemy movements
	if (keys.ArrowLeft.pressed && enemy.lastKey === "ArrowLeft") {
		enemy.velocity.x = -5
	} else if (keys.ArrowRight.pressed && enemy.lastKey === "ArrowRight") {
		enemy.velocity.x = 5
	}

	//detect hits
	if (
		hitDetection({
			player1: player,
			player2: enemy,
		}) &&
		player.isAttacking
	) {
		console.log("player hit")
		player.isAttacking = false
		enemy.health -= 20
		document.querySelector("#enemyHealth").style.width = enemy.health + "%"
	}

	if (
		hitDetection({
			player1: enemy,
			player2: player,
		}) &&
		enemy.isAttacking
	) {
		console.log("enemy hit")
		enemy.isAttacking = false
		player.health -= 20
		document.querySelector("#playerHealth").style.width = player.health + "%"
	}
}

animate()

window.addEventListener("keydown", (event) => {
	switch (event.key) {
		//player movements
		case "d":
			keys.d.pressed = true
			player.lastKey = "d"
			break
		case "a":
			keys.a.pressed = true
			player.lastKey = "a"
			break
		case "w":
			player.velocity.y = -12
			break
		case " ":
			player.attack() //spacebar
			break

		//enemy movements
		case "ArrowRight":
			keys.ArrowRight.pressed = true
			enemy.lastKey = "ArrowRight"
			break
		case "ArrowLeft":
			keys.ArrowLeft.pressed = true
			enemy.lastKey = "ArrowLeft"
			break
		case "ArrowUp":
			enemy.velocity.y = -12
			break
		case "0":
			enemy.attack()
			break
	}
})

window.addEventListener("keyup", (event) => {
	switch (event.key) {
		case "d":
			keys.d.pressed = false
			break
		case "a":
			keys.a.pressed = false
			break

		case "ArrowRight":
			keys.ArrowRight.pressed = false
			break
		case "ArrowLeft":
			keys.ArrowLeft.pressed = false
			break
	}
})
