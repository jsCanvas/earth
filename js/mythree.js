var lesson1 = {
            scene: null,
            camera: null,
            renderer: null,
            container: null,
            controls: null,
            clock: null,
            stats: null,

            init: function() { // 初始化
            	// 创建主要场景
        this.scene = new THREE.Scene();

        var SCREEN_WIDTH = window.innerWidth,
            SCREEN_HEIGHT = window.innerHeight;

        // 准备相机
        var VIEW_ANGLE = 17, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 1, FAR = 10000;
        this.camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
        this.scene.add(this.camera);
        this.camera.position.set(1000, 1000, 0);
        this.camera.lookAt(new THREE.Vector3(0,0,0));

        // 准备渲染
        this.renderer = new THREE.WebGLRenderer({antialias:true, alpha: false});
        this.renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
        // this.renderer.setClearColor(0xffffff);

        this.renderer.shadowMapEnabled = true;
        this.renderer.shadowMapSoft = true;

        // 准备容器
        this.container = document.createElement('div');
        this.container.id='thcontainer';
        document.body.appendChild(this.container);
        this.container.appendChild(this.renderer.domElement);
        // 准备控制器 (OrbitControls)
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.target = new THREE.Vector3(0, 0, 0);

        // 准备计时器
        this.clock = new THREE.Clock();

        // 准备统计
        this.stats = new Stats();
        this.stats.domElement.style.position = 'absolute';
        this.stats.domElement.style.bottom = '0px';
        this.stats.domElement.style.zIndex = 10;
        this.container.appendChild( this.stats.domElement );
        // 添加定向光线
        var dLight = new THREE.DirectionalLight(0xffffff);
        dLight.position.set(1, 1000, 1);
        dLight.castShadow = true;
        dLight.shadowCameraVisible = false;
        dLight.shadowDarkness = 0.2;
        dLight.shadowMapWidth = dLight.shadowMapHeight = 1000;
        this.scene.add(dLight);

        //添加半球光
        var hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x333333, 2);
         hemisphereLight.position.x = 0;
         hemisphereLight.position.y = 0;
         hemisphereLight.position.z = -200;
         this.scene.add(hemisphereLight);

        // 添加粒子光线
        particleLight = new THREE.Mesh( new THREE.SphereGeometry(5, 5, 5), new THREE.MeshBasicMaterial({ color: 0xffffff }));
        particleLight.position = dLight.position;
        this.scene.add(particleLight);
        var colors = [
            0xFF62B0,
            0x9A03FE,
            0x62D0FF,
            0x48FB0D,
            0xDFA800,
            0xC27E3A,
            0x990099,
            0x9669FE,
            0x23819C,
            0x01F33E,
            0xB6BA18,
            0xFF800D,
            0xB96F6F,
            0x4A9586
        ];

        this.getRandColor=function() {
            return colors[Math.floor(Math.random() * colors.length)];
        }

        var loader = new THREE.TextureLoader(),
        	messcene= this.scene; 
        loader.load( 'images/textures/earth.jpg', function ( texture ) {       var geometry = new THREE.SphereGeometry(200, 100, 100);       var material = new THREE.MeshBasicMaterial( { map: texture, overdraw: true } );      
        	mesh = new THREE.Mesh( geometry, material );      
        	// mesh.rotation.x = Math.PI/4;                  
        	mesh.rotation.y = Math.PI*1.4; 
        	mesh.position.y = 0; 
        	mesh.castShadow = mesh.receiveShadow = true;    
        	messcene.add( mesh );     } );
        for(var i=0;i<100;i++){
        	var particleLights = new THREE.Mesh( new THREE.SphereGeometry(4, 4, 4), new THREE.MeshLambertMaterial({ color: 0xffffff }));
        	particleLights.position.x = THREE.Math.randFloatSpread(2000);
        	particleLights.position.y = THREE.Math.randFloatSpread(2000);
        	particleLights.position.z = THREE.Math.randFloatSpread(2000);
        	particleLights.castShadow = particleLights.receiveShadow = true;
        	this.scene.add(particleLights);
        }
        	

            }
        };
        // lesson1.init();
        // 使场景动画化
        function animate() {
            requestAnimationFrame(animate);
            render();
            update();
        }

        // 更新控制器状态
        function update() {
            lesson1.controls.update(lesson1.clock.getDelta());
            lesson1.stats.update();
            var timer = Date.now() * 0.000025;
        	particleLight.position.x = Math.sin(timer * 5) * 300;
        	particleLight.position.z = Math.cos(timer * 5) * 300;
        }

        // 渲染场景
        function render() {
            if (lesson1.renderer) {
                lesson1.renderer.render(lesson1.scene, lesson1.camera);
            }
        }

        // 在页面加载时初始化 lesson 对象
        function initializeLesson() {
            lesson1.init();
            animate();
        }

        if (window.addEventListener)
            window.addEventListener('load', initializeLesson, false);
        else if (window.attachEvent)
            window.attachEvent('onload', initializeLesson);
        else window.onload = initializeLesson;