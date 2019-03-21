const allowedEvents = ['transitionstart', 'animationstart']
const startingFrequency = 600
const endingFrequency = 8000

let running = false

function generateAudio(duration) {
	if (running) return
	running = true
	const context = new (window.AudioContext || window.webkitAudioContext)()
	const osc = context.createOscillator()
	const now = context.currentTime
	osc.type = 'sine'
	osc.frequency.setValueAtTime(startingFrequency, now)
	osc.frequency.exponentialRampToValueAtTime(endingFrequency, now + duration)
	osc.connect(context.destination)
	osc.start()
	osc.stop(context.currentTime + duration)
	setTimeout(() => {
		running = false
	}, duration * 1000)
}

function animationListener(e) {
	const target = e.target
	if (allowedEvents.indexOf(e.type) === -1) return
	const styles = getComputedStyle(target)
	const duration =
		e.type === 'transitionstart' ? styles.transitionDuration : styles.animationDuration
	const seconds = Number(duration.replace('s', ''))
	if (isNaN(seconds)) return

	generateAudio(seconds)
}

document.addEventListener('animationstart', animationListener, false)
document.addEventListener('transitionstart', animationListener, false)
