document.getElementById('upload').addEventListener('change', function(event) {

	if (this.files[0]) {
		var loader = new OpenRasterBlobLoader(this.files[0]);
		loader.onload = function() {
			var xmlText = loader.textFile('stack.xml');
			var parser = new DOMParser();
			var xml = parser.parseFromString(xmlText, 'application/xml');
			var image = new OpenRasterImage(loader, xml.documentElement);
		
			var container = document.getElementById('image-container');
			var viewer = new ImageViewer(image, container);
		};
	}
});
