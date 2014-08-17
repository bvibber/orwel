/**
 * @param OpenRasterImage image
 * @param HTMLElement container
 */
function ImageViewer(image, container) {
	
	function viewLayer(layer, subcontainer) {
		if (layer.type === 'layer') {
			var img = layer.image;
			img.style.position = 'absolute';
			img.style.width = layer.w + 'px';
			img.style.height = layer.h + 'px';
			subcontainer.appendChild(img);
		} else if (layer.type === 'stack') {
			var stackContainer = document.createElement('div');
			stackContainer.style.position = 'absolute';
			if (layer === image.stack) {
				stackContainer.style.width = image.w + 'px';
				stackContainer.style.height = image.h + 'px';
			} else {
				stackContainer.style.left = layer.x + 'px';
				stackContainer.style.top = layer.y + 'px';
				stackContainer.style.width = layer.w + 'px';
				stackContainer.style.height = layer.h + 'px';
			}
			layer.layers.forEach(function(child) {
				viewLayer(child, stackContainer);
			});
			subcontainer.appendChild(stackContainer);
		} else {
			throw new Error("Unknown layer type " + layer.type);
		}
	}

	viewLayer(image.stack, container);
}
