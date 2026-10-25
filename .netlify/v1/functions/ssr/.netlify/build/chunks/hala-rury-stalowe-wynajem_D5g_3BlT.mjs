const hallImage = new Proxy({"src":"/_astro/hala-rury-stalowe-wynajem.CynUbMuc.jpg","width":1024,"height":683,"format":"webp"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "F:/Strony/Strony W toku/ecotech-astro/src/assets/img/main/hala-rury-stalowe-wynajem.jpg";
							}
							
							return target[name];
						}
					});

export { hallImage as h };
