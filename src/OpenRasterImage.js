/**
 * @todo bump unzipping to worker thread?
 * @todo rework file interfaces to load async?
 */
function OpenRasterBlobLoader(blob) {
	var self = this,
		zip = JSZip(),
		reader = new FileReader();

	self.onload = function() {};
	self.ready = false;

	reader.readAsArrayBuffer(blob);
	reader.onload = function() {
		zip.load(reader.result);
		self.ready = true;
		self.onload();
	};
	
	self.textFile = function(filename) {
		if (self.ready) {
			var obj = zip.file(filename);
			return obj.asText();
		} else {
			throw new Error("Can't load text file before ready");
		}
	};
	
	self.binaryFile = function(filename, mimetype) {
		if (self.ready) {
			var obj = zip.file(filename);
			return new Blob(
				[obj.asArrayBuffer()],
				{type: mimetype || 'application/octet-stream'}
			);
		} else {
			throw new Error("Can't load binary file before ready");
		}
	};
}


function strAttr(element, attributeName, defaultValue) {
	var val = null;
	if (element) {
		val = element.getAttribute(attributeName);
	}
	if (val == null) {
		return defaultValue;
	} else {
		return val;
	}
}

function intAttr(element, attributeName, defaultValue) {
	var val = strAttr(element, attributeName);
	if (val === undefined) {
		return defaultValue;
	} else {
		return parseInt(val, 10);
	}
}

function floatAttr(element, attributeName, defaultValue) {
	var val = strAttr(element, attributeName);
	if (val === undefined) {
		return defaultValue;
	} else {
		return parseFloat(val);
	}
}

OpenRasterImage = function(loader, element) {
	this.version = strAttr(element, 'version', '0'); // ??????
	if (this.version === undefined) {
		throw new Error("Invalid image; missing version attribute");
	}
	this.w = intAttr(element, 'w', 0);
	if (this.w <= 0) {
		throw new Error("Invalid image; w must be positive");
	}
	this.h = intAttr(element, 'h', 0);
	if (this.h <= 0) {
		throw new Error("Invalid image; h must be positive");
	}

	this.xres = intAttr(element, 'xres', 72);
	this.yres = intAttr(element, 'yres', 72);

	var rootStackElement = element.querySelector('stack:first-child');
	this.stack = new OpenRasterStack(loader, rootStackElement);
};

OpenRasterLayerBase = function(loader, element) {
	this.x = intAttr(element, 'x', 0);
	this.y = intAttr(element, 'y', 0);
	this.name = strAttr(element, 'name', '');
	this.opacity = floatAttr(element, 'opacity', 1.0);
	this.visibility = strAttr(element, 'visibility', 'visible');
	this.compositeOp = strAttr(element, 'composite-op', 'svg:src-over');
};

OpenRasterStack = function(loader, element) {
	OpenRasterLayerBase.apply(this, [loader, element]);
	this.type = 'stack';
	this.layers = [];
	for (var node = element.firstChild; node; node = node.nextSibling) {
		if (node.nodeType === Node.ELEMENT_NODE) {
			if (node.nodeName.toLowerCase() === 'layer') {
				this.layers.push(new OpenRasterLayer(loader, node));
			} else if (node.nodeName.toLowerCase() === 'stack') {
				this.layers.push(new OpenRasterStack(loader, node));
			} else if (node.nodeName.toLowerCase() === 'text') {
				this.layers.push(new OpenRasterText(loader, node));
			} else {
				throw new Exception("Unexpected layer type: " + node.nodeName);
			}
		}
	}
}

OpenRasterLayer = function(loader, element) {
	var self = this;
	OpenRasterLayerBase.apply(this, [loader, element]);
	this.type = 'layer';
	this.src = strAttr(element, 'src');
	this.ready = false;
	this.onload = function() {};

	// Unzipping is currently synchronous.
	// Might need to rework this for indexedDB storage
	this.imageBlob = loader.binaryFile(this.src);
	this.imageUrl = URL.createObjectURL(this.imageBlob);
	this.image = new Image();
	this.image.onload = function() {
		self.ready = true;
		self.onload();
	};
	this.image.src = this.imageUrl;
}
