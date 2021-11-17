export class ButtonFunctionality {
	constructor(id: string) {
		let btn = document.getElementById(id);
		if(id === "fileinput") {
			btn.addEventListener("change", (e:Event) => this.handleFile(id));
		}
		else {
			btn.addEventListener("click", (e:Event) => this.clicked(id));
			btn.addEventListener("mouseover", (e: Event) => this.onHoverIn(id));
			btn.addEventListener("mouseout", (e: Event) => this.onHoverOut(id));
		}
	}
	clicked(id: string): void {
		console.log("meow");
		document.getElementById(id).style.backgroundColor = "lightgreen";
	}
	onHoverIn(id: string): void {
		document.getElementById(id).style.backgroundColor = "rgb(4, 119, 119)";
		// "red";
		document.getElementById(id).style.borderColor = "rgba(47, 168, 168, 0.5)";
		// "rgba(184, 184, 5, 0.5)";
	}
	onHoverOut(id: string): void {
		document.getElementById(id).style.backgroundColor = "white";
		document.getElementById(id).style.borderColor = "rgb(47, 168, 168, 5)";
	}
	handleFile(id): void {
		const input = document.getElementById(id);
		const file = input.files[0];
		let fileContent = "";

		const fr = new FileReader();
		fr.onload = () => {
			fileContent = fr.result;
			loadOBJ(fileContent);
		}

		fr.readAsText(file);
	}
}