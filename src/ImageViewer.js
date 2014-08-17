/**
 * @param OpenRasterImage image
 * @param HTMLElement container
 */
function ImageViewer(image, container) {
	
	function viewLayer(layer, subcontainer) {
		if (layer.type === 'layer') {
			var img = layer.image;
			img.style.position = 'absolute';
			img.style.left = layer.x + 'px';
			img.style.top = layer.y + 'px';
			subcontainer.insertBefore(img, subcontainer.firstChild);
		} else if (layer.type === 'stack') {
			var stackContainer = document.createElement('div');
			stackContainer.style.position = 'absolute';
			if (layer === image.stack) {
				stackContainer.style.width = image.w + 'px';
				stackContainer.style.height = image.h + 'px';
			} else {
				stackContainer.style.left = layer.x + 'px';
				stackContainer.style.top = layer.y + 'px';
			}
			layer.layers.forEach(function(child) {
				viewLayer(child, stackContainer);
			});
			subcontainer.insertBefore(stackContainer, subcontainer.firstChild);
		} else {
			throw new Error("Unknown layer type " + layer.type);
		}
	}

	viewLayer(image.stack, container);
}
