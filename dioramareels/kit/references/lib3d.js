/* lib3d.js bundles three.js r147 examples/js/utils/SkeletonUtils.js (MIT License, Copyright 2010-2022 three.js authors). */
( function () {

	function retarget( target, source, options = {} ) {

		const pos = new THREE.Vector3(),
			quat = new THREE.Quaternion(),
			scale = new THREE.Vector3(),
			bindBoneMatrix = new THREE.Matrix4(),
			relativeMatrix = new THREE.Matrix4(),
			globalMatrix = new THREE.Matrix4();
		options.preserveMatrix = options.preserveMatrix !== undefined ? options.preserveMatrix : true;
		options.preservePosition = options.preservePosition !== undefined ? options.preservePosition : true;
		options.preserveHipPosition = options.preserveHipPosition !== undefined ? options.preserveHipPosition : false;
		options.useTargetMatrix = options.useTargetMatrix !== undefined ? options.useTargetMatrix : false;
		options.hip = options.hip !== undefined ? options.hip : 'hip';
		options.names = options.names || {};
		const sourceBones = source.isObject3D ? source.skeleton.bones : getBones( source ),
			bones = target.isObject3D ? target.skeleton.bones : getBones( target );
		let bindBones, bone, name, boneTo, bonesPosition;

		// reset bones

		if ( target.isObject3D ) {

			target.skeleton.pose();

		} else {

			options.useTargetMatrix = true;
			options.preserveMatrix = false;

		}

		if ( options.preservePosition ) {

			bonesPosition = [];
			for ( let i = 0; i < bones.length; i ++ ) {

				bonesPosition.push( bones[ i ].position.clone() );

			}

		}

		if ( options.preserveMatrix ) {

			// reset matrix

			target.updateMatrixWorld();
			target.matrixWorld.identity();

			// reset children matrix

			for ( let i = 0; i < target.children.length; ++ i ) {

				target.children[ i ].updateMatrixWorld( true );

			}

		}

		if ( options.offsets ) {

			bindBones = [];
			for ( let i = 0; i < bones.length; ++ i ) {

				bone = bones[ i ];
				name = options.names[ bone.name ] || bone.name;
				if ( options.offsets[ name ] ) {

					bone.matrix.multiply( options.offsets[ name ] );
					bone.matrix.decompose( bone.position, bone.quaternion, bone.scale );
					bone.updateMatrixWorld();

				}

				bindBones.push( bone.matrixWorld.clone() );

			}

		}

		for ( let i = 0; i < bones.length; ++ i ) {

			bone = bones[ i ];
			name = options.names[ bone.name ] || bone.name;
			boneTo = getBoneByName( name, sourceBones );
			globalMatrix.copy( bone.matrixWorld );
			if ( boneTo ) {

				boneTo.updateMatrixWorld();
				if ( options.useTargetMatrix ) {

					relativeMatrix.copy( boneTo.matrixWorld );

				} else {

					relativeMatrix.copy( target.matrixWorld ).invert();
					relativeMatrix.multiply( boneTo.matrixWorld );

				}

				// ignore scale to extract rotation

				scale.setFromMatrixScale( relativeMatrix );
				relativeMatrix.scale( scale.set( 1 / scale.x, 1 / scale.y, 1 / scale.z ) );

				// apply to global matrix

				globalMatrix.makeRotationFromQuaternion( quat.setFromRotationMatrix( relativeMatrix ) );
				if ( target.isObject3D ) {

					const boneIndex = bones.indexOf( bone ),
						wBindMatrix = bindBones ? bindBones[ boneIndex ] : bindBoneMatrix.copy( target.skeleton.boneInverses[ boneIndex ] ).invert();
					globalMatrix.multiply( wBindMatrix );

				}

				globalMatrix.copyPosition( relativeMatrix );

			}

			if ( bone.parent && bone.parent.isBone ) {

				bone.matrix.copy( bone.parent.matrixWorld ).invert();
				bone.matrix.multiply( globalMatrix );

			} else {

				bone.matrix.copy( globalMatrix );

			}

			if ( options.preserveHipPosition && name === options.hip ) {

				bone.matrix.setPosition( pos.set( 0, bone.position.y, 0 ) );

			}

			bone.matrix.decompose( bone.position, bone.quaternion, bone.scale );
			bone.updateMatrixWorld();

		}

		if ( options.preservePosition ) {

			for ( let i = 0; i < bones.length; ++ i ) {

				bone = bones[ i ];
				name = options.names[ bone.name ] || bone.name;
				if ( name !== options.hip ) {

					bone.position.copy( bonesPosition[ i ] );

				}

			}

		}

		if ( options.preserveMatrix ) {

			// restore matrix

			target.updateMatrixWorld( true );

		}

	}

	function retargetClip( target, source, clip, options = {} ) {

		options.useFirstFramePosition = options.useFirstFramePosition !== undefined ? options.useFirstFramePosition : false;
		options.fps = options.fps !== undefined ? options.fps : 30;
		options.names = options.names || [];
		if ( ! source.isObject3D ) {

			source = getHelperFromSkeleton( source );

		}

		const numFrames = Math.round( clip.duration * ( options.fps / 1000 ) * 1000 ),
			delta = 1 / options.fps,
			convertedTracks = [],
			mixer = new THREE.AnimationMixer( source ),
			bones = getBones( target.skeleton ),
			boneDatas = [];
		let positionOffset, bone, boneTo, boneData, name;
		mixer.clipAction( clip ).play();
		mixer.update( 0 );
		source.updateMatrixWorld();
		for ( let i = 0; i < numFrames; ++ i ) {

			const time = i * delta;
			retarget( target, source, options );
			for ( let j = 0; j < bones.length; ++ j ) {

				name = options.names[ bones[ j ].name ] || bones[ j ].name;
				boneTo = getBoneByName( name, source.skeleton );
				if ( boneTo ) {

					bone = bones[ j ];
					boneData = boneDatas[ j ] = boneDatas[ j ] || {
						bone: bone
					};
					if ( options.hip === name ) {

						if ( ! boneData.pos ) {

							boneData.pos = {
								times: new Float32Array( numFrames ),
								values: new Float32Array( numFrames * 3 )
							};

						}

						if ( options.useFirstFramePosition ) {

							if ( i === 0 ) {

								positionOffset = bone.position.clone();

							}

							bone.position.sub( positionOffset );

						}

						boneData.pos.times[ i ] = time;
						bone.position.toArray( boneData.pos.values, i * 3 );

					}

					if ( ! boneData.quat ) {

						boneData.quat = {
							times: new Float32Array( numFrames ),
							values: new Float32Array( numFrames * 4 )
						};

					}

					boneData.quat.times[ i ] = time;
					bone.quaternion.toArray( boneData.quat.values, i * 4 );

				}

			}

			mixer.update( delta );
			source.updateMatrixWorld();

		}

		for ( let i = 0; i < boneDatas.length; ++ i ) {

			boneData = boneDatas[ i ];
			if ( boneData ) {

				if ( boneData.pos ) {

					convertedTracks.push( new THREE.VectorKeyframeTrack( '.bones[' + boneData.bone.name + '].position', boneData.pos.times, boneData.pos.values ) );

				}

				convertedTracks.push( new THREE.QuaternionKeyframeTrack( '.bones[' + boneData.bone.name + '].quaternion', boneData.quat.times, boneData.quat.values ) );

			}

		}

		mixer.uncacheAction( clip );
		return new THREE.AnimationClip( clip.name, - 1, convertedTracks );

	}

	function getHelperFromSkeleton( skeleton ) {

		const source = new THREE.SkeletonHelper( skeleton.bones[ 0 ] );
		source.skeleton = skeleton;
		return source;

	}

	function getSkeletonOffsets( target, source, options = {} ) {

		const targetParentPos = new THREE.Vector3(),
			targetPos = new THREE.Vector3(),
			sourceParentPos = new THREE.Vector3(),
			sourcePos = new THREE.Vector3(),
			targetDir = new THREE.Vector2(),
			sourceDir = new THREE.Vector2();
		options.hip = options.hip !== undefined ? options.hip : 'hip';
		options.names = options.names || {};
		if ( ! source.isObject3D ) {

			source = getHelperFromSkeleton( source );

		}

		const nameKeys = Object.keys( options.names ),
			nameValues = Object.values( options.names ),
			sourceBones = source.isObject3D ? source.skeleton.bones : getBones( source ),
			bones = target.isObject3D ? target.skeleton.bones : getBones( target ),
			offsets = [];
		let bone, boneTo, name, i;
		target.skeleton.pose();
		for ( i = 0; i < bones.length; ++ i ) {

			bone = bones[ i ];
			name = options.names[ bone.name ] || bone.name;
			boneTo = getBoneByName( name, sourceBones );
			if ( boneTo && name !== options.hip ) {

				const boneParent = getNearestBone( bone.parent, nameKeys ),
					boneToParent = getNearestBone( boneTo.parent, nameValues );
				boneParent.updateMatrixWorld();
				boneToParent.updateMatrixWorld();
				targetParentPos.setFromMatrixPosition( boneParent.matrixWorld );
				targetPos.setFromMatrixPosition( bone.matrixWorld );
				sourceParentPos.setFromMatrixPosition( boneToParent.matrixWorld );
				sourcePos.setFromMatrixPosition( boneTo.matrixWorld );
				targetDir.subVectors( new THREE.Vector2( targetPos.x, targetPos.y ), new THREE.Vector2( targetParentPos.x, targetParentPos.y ) ).normalize();
				sourceDir.subVectors( new THREE.Vector2( sourcePos.x, sourcePos.y ), new THREE.Vector2( sourceParentPos.x, sourceParentPos.y ) ).normalize();
				const laterialAngle = targetDir.angle() - sourceDir.angle();
				const offset = new THREE.Matrix4().makeRotationFromEuler( new THREE.Euler( 0, 0, laterialAngle ) );
				bone.matrix.multiply( offset );
				bone.matrix.decompose( bone.position, bone.quaternion, bone.scale );
				bone.updateMatrixWorld();
				offsets[ name ] = offset;

			}

		}

		return offsets;

	}

	function renameBones( skeleton, names ) {

		const bones = getBones( skeleton );
		for ( let i = 0; i < bones.length; ++ i ) {

			const bone = bones[ i ];
			if ( names[ bone.name ] ) {

				bone.name = names[ bone.name ];

			}

		}

		return this;

	}

	function getBones( skeleton ) {

		return Array.isArray( skeleton ) ? skeleton : skeleton.bones;

	}

	function getBoneByName( name, skeleton ) {

		for ( let i = 0, bones = getBones( skeleton ); i < bones.length; i ++ ) {

			if ( name === bones[ i ].name ) return bones[ i ];

		}

	}

	function getNearestBone( bone, names ) {

		while ( bone.isBone ) {

			if ( names.indexOf( bone.name ) !== - 1 ) {

				return bone;

			}

			bone = bone.parent;

		}

	}

	function findBoneTrackData( name, tracks ) {

		const regexp = /\[(.*)\]\.(.*)/,
			result = {
				name: name
			};
		for ( let i = 0; i < tracks.length; ++ i ) {

			// 1 is track name
			// 2 is track type
			const trackData = regexp.exec( tracks[ i ].name );
			if ( trackData && name === trackData[ 1 ] ) {

				result[ trackData[ 2 ] ] = i;

			}

		}

		return result;

	}

	function getEqualsBonesNames( skeleton, targetSkeleton ) {

		const sourceBones = getBones( skeleton ),
			targetBones = getBones( targetSkeleton ),
			bones = [];
		search: for ( let i = 0; i < sourceBones.length; i ++ ) {

			const boneName = sourceBones[ i ].name;
			for ( let j = 0; j < targetBones.length; j ++ ) {

				if ( boneName === targetBones[ j ].name ) {

					bones.push( boneName );
					continue search;

				}

			}

		}

		return bones;

	}

	function clone( source ) {

		const sourceLookup = new Map();
		const cloneLookup = new Map();
		const clone = source.clone();
		parallelTraverse( source, clone, function ( sourceNode, clonedNode ) {

			sourceLookup.set( clonedNode, sourceNode );
			cloneLookup.set( sourceNode, clonedNode );

		} );
		clone.traverse( function ( node ) {

			if ( ! node.isSkinnedMesh ) return;
			const clonedMesh = node;
			const sourceMesh = sourceLookup.get( node );
			const sourceBones = sourceMesh.skeleton.bones;
			clonedMesh.skeleton = sourceMesh.skeleton.clone();
			clonedMesh.bindMatrix.copy( sourceMesh.bindMatrix );
			clonedMesh.skeleton.bones = sourceBones.map( function ( bone ) {

				return cloneLookup.get( bone );

			} );
			clonedMesh.bind( clonedMesh.skeleton, clonedMesh.bindMatrix );

		} );
		return clone;

	}

	function parallelTraverse( a, b, callback ) {

		callback( a, b );
		for ( let i = 0; i < a.children.length; i ++ ) {

			parallelTraverse( a.children[ i ], b.children[ i ], callback );

		}

	}

	THREE.SkeletonUtils = {};
	THREE.SkeletonUtils.clone = clone;
	THREE.SkeletonUtils.findBoneTrackData = findBoneTrackData;
	THREE.SkeletonUtils.getBoneByName = getBoneByName;
	THREE.SkeletonUtils.getBones = getBones;
	THREE.SkeletonUtils.getEqualsBonesNames = getEqualsBonesNames;
	THREE.SkeletonUtils.getHelperFromSkeleton = getHelperFromSkeleton;
	THREE.SkeletonUtils.getNearestBone = getNearestBone;
	THREE.SkeletonUtils.getSkeletonOffsets = getSkeletonOffsets;
	THREE.SkeletonUtils.renameBones = renameBones;
	THREE.SkeletonUtils.retarget = retarget;
	THREE.SkeletonUtils.retargetClip = retargetClip;

} )();
/* lib3d.js: the 3D kit's model library for reels (people, animals, props, nature, buildings, ready-made places).
   Models live in dioramareels/kit/assets/<group>/<name>.glb (all CC0, see assets/LICENSES.md); render.py serves them at
   https://kit.assets/<group>/<name>.glb. A reel lists what it needs, the kit loads it, then the reel builds:
     LIB.need(['humans/Superhero_Male', 'animals/deer']).then(() => { ...build... });   (render.py waits for window.REEL_READY)
   or simply DIY(build, { assets: [...] }) with the DIY kit.
   LIB.human({ body: 'm'|'f'|'woman_casual'|'woman_dress'|'woman_jacket'|'woman_tanktop', top, bottom, shoes, skin, hair,
     hairStyle: 'short'|'long'|'bun'|'buzz'|'none', sleeves: 'long'|'short', legs: 'long'|'shorts', h: height in scene units })
     -> Group with .pose(move, t) (moves: idle walk run sprint sit sittalk talk punch jab death hit hithead pickup push
        crouch crouchwalk drive dance kneel jump swim interact roll pistol formalwalk; or a raw clip name) and .bone(name).
   LIB.animal(name, { h }) -> Group with .pose(move, t) (idle walk gallop eat attack death jump hit); names: alpaca bull cow
     deer dog donkey fox horse horse_white husky sheep stag wolf.
   LIB.prop('props/chair', { h }) -> a copy scaled to height h (or { w } width). LIB.list() -> every model name.
   LIB.place.room / park / village / street / courtroom / cell / office / kitchen(opts) -> Group (built from models + primitives),
   each with .spots (named positions to stand people) and .cam (a good wide camera). Units: 1 = 1 metre unless h/scale given. */
(() => {
  const T = THREE, PI = Math.PI, BASE = 'https://kit.assets/';
  const cache = {}, loader = new T.GLTFLoader();
  const LIB = window.LIB = { gltf: {} };
  LIB.load = (n) => cache[n] || (cache[n] = new Promise((res, rej) => loader.load(BASE + n + '.glb', (g) => { LIB.gltf[n] = g; res(g); }, undefined, (e) => rej(new Error('LIB: cannot load ' + n + ': ' + (e && e.message))))));
  LIB.need = (list) => Promise.all(list.map(LIB.load));
  const get = (n) => { const g = LIB.gltf[n]; if (!g) throw new Error(`LIB: '${n}' was not loaded; add it to the reel's assets list`); return g; };
  const fit = (o, { h, w, scale } = {}) => { o.updateMatrixWorld(true); const bb = new T.Box3().setFromObject(o), sz = bb.getSize(new T.Vector3());
    const k = scale || (h ? h / sz.y : w ? w / Math.max(sz.x, sz.z) : 1); o.scale.multiplyScalar(k); o.updateMatrixWorld(true); const b2 = new T.Box3().setFromObject(o); o.position.y -= b2.min.y; const c2 = b2.getCenter(new T.Vector3()), s2 = b2.getSize(new T.Vector3()); if (Math.hypot(c2.x, c2.z) > Math.max(s2.x, s2.z)) { o.position.x -= c2.x; o.position.z -= c2.z; } return o; }; // models authored far from their origin get centred
  const wrap = (inner, opts) => { const g = new T.Group(); g.add(inner); fit(inner, opts); g.traverse((n) => { if (n.isMesh) { n.castShadow = true; n.receiveShadow = true; n.frustumCulled = false; } }); return g; };
  LIB.prop = (n, opts = {}) => { const g = get(n); return wrap(T.SkeletonUtils.clone(g.scene), opts); };
  const MOVES = { idle: 'Idle_Loop', walk: 'Walk_Loop', run: 'Jog_Fwd_Loop', sprint: 'Sprint_Loop', sit: 'Sitting_Idle_Loop', sittalk: 'Sitting_Talking_Loop', sitdown: 'Sitting_Enter', standup: 'Sitting_Exit',
    talk: 'Idle_Talking_Loop', punch: 'Punch_Cross', jab: 'Punch_Jab', death: 'Death01', hit: 'Hit_Chest', hithead: 'Hit_Head', pickup: 'PickUp_Table', push: 'Push_Loop', crouch: 'Crouch_Idle_Loop',
    crouchwalk: 'Crouch_Fwd_Loop', drive: 'Driving_Loop', dance: 'Dance_Loop', kneel: 'Fixing_Kneeling', jump: 'Jump_Loop', swim: 'Swim_Fwd_Loop', interact: 'Interact', roll: 'Roll', pistol: 'Pistol_Idle_Loop',
    formalwalk: 'Walk_Formal_Loop', torch: 'Idle_Torch_Loop', spell: 'Spell_Simple_Idle_Loop', sword: 'Sword_Idle', tpose: 'A_TPose' };
  const WMOVES = { idle: 'Female_Idle', walk: 'Female_Walk', run: 'Female_Run', sprint: 'Female_Run', sit: 'Female_Sitting', sittalk: 'Female_Sitting', talk: 'Female_Standing', punch: 'Female_Punch', jab: 'Female_Punch',
    death: 'Female_Death', jump: 'Female_Jump', clap: 'Female_Clapping', sword: 'Female_SwordSlash', dance: 'Female_Clapping', hit: 'Female_Jump', hithead: 'Female_Jump', crouch: 'Female_Sitting', pickup: 'Female_Standing', kneel: 'Female_Sitting', wave: 'Female_Standing' };
  const EMOVES = { idle: 'Idle_Neutral', walk: 'Walk', run: 'Run', sprint: 'Run', sit: 'Idle', sittalk: 'Interact', talk: 'Interact', punch: 'Punch_Right', jab: 'Punch_Left', death: 'Death', hit: 'HitRecieve', hithead: 'HitRecieve_2', pickup: 'Interact', push: 'Interact',
    crouch: 'Idle', crouchwalk: 'Walk', dance: 'Wave', kneel: 'Idle', jump: 'HitRecieve', clap: 'Wave', wave: 'Wave', pistol: 'Idle_Gun_Pointing', shoot: 'Gun_Shoot', kick: 'Kick_Right', roll: 'Roll', interact: 'Interact', standup: 'Idle', sitdown: 'Idle', drive: 'Idle' };
  // Kenney Mini Characters (CC0): chunky toy people for the toy channel. Used for body 'm' / 'f' / 'woman_*' whenever the reel loads 'mini/*' assets.
  const KMOVES = new Proxy({ idle: 'idle', walk: 'walk', walkslow: 'walk', formalwalk: 'walk', run: 'sprint', sprint: 'sprint', swim: 'sprint', sit: 'sit', sittalk: 'sit', sitdown: 'sit', standup: 'idle', talk: 'idle', dance: 'emote-yes', clap: 'emote-yes',
    punch: 'attack-melee-right', jab: 'attack-melee-left', attack: 'attack-melee-right', sword: 'attack-melee-right', kick: 'attack-kick-right', death: 'die', hit: 'fall', roll: 'fall', hithead: 'emote-no', no: 'emote-no', yes: 'emote-yes',
    pickup: 'pick-up', push: 'interact-right', interact: 'interact-right', eat: 'interact-right', spell: 'interact-right', wave: 'interact-left', crouch: 'crouch', crouchwalk: 'crouch', kneel: 'crouch', drive: 'drive', jump: 'jump',
    pistol: 'holding-right-shoot', shoot: 'holding-right-shoot', torch: 'holding-right', hold: 'holding-both', tpose: 'static' }, { get: (o, k) => o[k] || 'idle' });
  const miniCount = { m: 0, f: 0 };
  const AMOVES = { idle: ['Idle'], walk: ['Walk', 'WalkSlow'], walkslow: ['WalkSlow', 'Walk'], gallop: ['Gallop', 'Run'], run: ['Gallop', 'Run'], eat: ['Eating', 'Idle_Headlow', 'Idle_2_HeadLow', 'Idle'], attack: ['Attack', 'Attack_Headbutt', 'Attack_Kick', 'Idle'],
    death: ['Death'], jump: ['Gallop_Jump', 'Jump'], hit: ['Idle_HitReact_Left', 'Idle'], idle2: ['Idle_2', 'Idle'], headlow: ['Idle_Headlow', 'Idle_2_HeadLow', 'Idle'] };
  // clips from the animation library, cleaned for other bodies: keep rotations, and the pelvis/root position only
  let UAL = null; const ual = () => UAL || (UAL = Object.fromEntries(get('humans/ual1').animations.map((c) => [c.name, new T.AnimationClip(c.name, c.duration, c.tracks.filter((tr) => /\.quaternion$/.test(tr.name) || /^(pelvis|root)\.position$/.test(tr.name)))])));
  const poser = (root, clips, map) => { const mixer = new T.AnimationMixer(root), acts = {}; let cur = null;
    return (move, t = 0, speed = 1) => { const name = map[move] || move; const clip = clips[name] || clips[Object.keys(clips).find((k) => k.endsWith('|' + name) || k.toLowerCase() === String(name).toLowerCase())];
      if (!clip) throw new Error('LIB: no move ' + move + ' (have ' + Object.keys(clips).slice(0, 12).join(', ') + ')');
      if (cur !== clip.name) { mixer.stopAllAction(); acts[clip.name] = acts[clip.name] || mixer.clipAction(clip); acts[clip.name].play(); cur = clip.name; }
      let tt = Math.max(0, t * speed); if (/death|enter|exit|land|hitreact/i.test(clip.name)) tt = Math.min(tt, clip.duration - 0.02); // one-shot clips hold their last frame
      mixer.setTime(tt); return root; }; };
  // painted clothes for the realistic base bodies: every vertex takes the colour of the bones that move it (soft edges)
  const REGION = (b, o) => { b = b.toLowerCase();
    if (/head|neck|eye|jaw/.test(b)) return 'skin'; if (/hand|index|middle|ring|pinky|thumb/.test(b)) return 'skin';
    if (o.topless && /lowerarm|upperarm|spine|clavicle/.test(b)) return 'skin'; if (/lowerarm/.test(b)) return o.sleeves === 'short' ? 'skin' : 'top'; if (/upperarm/.test(b)) return o.sleeves === 'none' ? 'skin' : 'top';
    if (/spine|clavicle/.test(b)) return 'top'; if (/pelvis|root/.test(b)) return 'bottom'; if (/thigh/.test(b)) return 'bottom';
    if (/calf/.test(b)) return o.legs === 'shorts' ? 'skin' : 'bottom'; if (/foot|ball/.test(b)) return 'shoes'; return 'skin'; };
  const GC = (a, i, k) => (k === 0 ? a.getX(i) : k === 1 ? a.getY(i) : k === 2 ? a.getZ(i) : a.getW(i)); // BufferAttribute.getComponent is newer than r149
  const dress = (mesh, o) => { const geo = mesh.geometry = mesh.geometry.clone(), si = geo.attributes.skinIndex, sw = geo.attributes.skinWeight, bones = mesh.skeleton.bones;
    const col = { top: new T.Color(o.top).convertSRGBToLinear(), bottom: new T.Color(o.bottom).convertSRGBToLinear(), shoes: new T.Color(o.shoes).convertSRGBToLinear() }; const arr = new Float32Array(si.count * 4);
    for (let i = 0; i < si.count; i++) { let r = 0, g = 0, b = 0, a = 0; for (let k = 0; k < 4; k++) { const w = GC(sw, i, k); if (!w) continue; const reg = REGION(bones[GC(si, i, k)].name, o);
        if (reg !== 'skin') { r += col[reg].r * w; g += col[reg].g * w; b += col[reg].b * w; a += w; } }
      if (a > 0) { r /= a; g /= a; b /= a; } arr.set([r, g, b, Math.min(1, a * 1.25)], i * 4); }
    // painted hair: head vertices above the hairline take the hair colour (shape follows the skull exactly)
    if (o.hairStyle !== 'none' && o.eyes) { const pos = geo.attributes.position, hi = bones.findIndex((x) => /^head$/i.test(x.name)), v = new T.Vector3();
      const isHead = (i) => { for (let q = 0; q < 4; q++) if (GC(si, i, q) === hi && GC(sw, i, q) > 0.5) return true; return false; };
      const Hc = new T.Vector3(), Fc = new T.Vector3(); let nh = 0, nf = 0; for (let i = 0; i < pos.count; i++) { v.fromBufferAttribute(pos, i); if (isHead(i)) { Hc.add(v); nh++; } else if (/foot|ball/.test(bones[GC(si, i, 0)].name)) { Fc.add(v); nf++; } }
      Hc.divideScalar(nh); Fc.divideScalar(Math.max(1, nf)); const up = Hc.clone().sub(Fc).normalize(); const fw = o.eyes.clone().sub(Hc); fw.sub(up.clone().multiplyScalar(fw.dot(up))).normalize();
      let top = -1e9, bot = 1e9, ff = -1e9; for (let i = 0; i < pos.count; i++) if (isHead(i)) { v.fromBufferAttribute(pos, i).sub(Hc); const h = v.dot(up); top = Math.max(top, h); bot = Math.min(bot, h); ff = Math.max(ff, v.dot(fw)); }
      const span = top - bot, hc = new T.Color(o.hair || '#2a1a10').convertSRGBToLinear(), deep = { buzz: 0.3, short: 0.4, long: 0.62, bun: 0.45 }[o.hairStyle || 'short'] || 0.4;
      for (let i = 0; i < pos.count; i++) { if (!isHead(i)) continue; v.fromBufferAttribute(pos, i).sub(Hc); const h = (v.dot(up) - bot) / span, f = v.dot(fw) / ff; // h: 0 chin .. 1 crown, f: 1 = face front
        const line = f > 0.55 ? 1 - 0.24 : (f > 0.2 ? 1 - deep * 0.7 : 1 - deep); const e = Math.max(0, Math.min(1, (h - line) / 0.04)); if (e <= 0) continue; const j = i * 4;
        arr[j] = arr[j] * (1 - e) + hc.r * e; arr[j + 1] = arr[j + 1] * (1 - e) + hc.g * e; arr[j + 2] = arr[j + 2] * (1 - e) + hc.b * e; arr[j + 3] = Math.max(arr[j + 3], e * (o.hairStyle === 'buzz' ? 0.85 : 0.97)); } }
    geo.setAttribute('cloth', new T.BufferAttribute(arr, 4)); const m = mesh.material = mesh.material.clone(); const tint = new T.Color(o.skin || '#ffffff').convertSRGBToLinear();
    m.onBeforeCompile = (sh) => { sh.uniforms.skinTint = { value: tint };
      sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nattribute vec4 cloth;\nvarying vec4 vCloth;').replace('#include <begin_vertex>', '#include <begin_vertex>\nvCloth = cloth;\ntransformed += objectNormal * cloth.a * 0.014;'); // cloth sits a little off the skin
      sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\nvarying vec4 vCloth;\nuniform vec3 skinTint;')
        .replace('#include <map_fragment>', '#include <map_fragment>\ndiffuseColor.rgb *= skinTint;\nfloat fab = 0.92 + 0.08 * sin(vViewPosition.y * 900.0) * sin(vViewPosition.x * 900.0);\ndiffuseColor.rgb = mix(diffuseColor.rgb, vCloth.rgb * fab, vCloth.a);'); };
    m.customProgramCacheKey = () => 'cloth'; m.roughness = 0.75; if (m.normalScale) m.normalScale.set(0.35, 0.35); };
  const hairOn = (root, mesh, o) => { if (o.hairStyle === 'none') return; const bones = mesh.skeleton.bones, head = bones.find((b) => /^head$/i.test(b.name)); if (!head) return;
    // head size from the body height (a 1.78 m body has a head about 0.22 m tall), centred above the head bone
    root.updateMatrixWorld(true); const H = o._H || 1.78, k = H / 1.78, hp = head.getWorldPosition(new T.Vector3()), fw = new T.Vector3(0, 0, 1).applyQuaternion(root.getWorldQuaternion(new T.Quaternion()));
    const bb = new T.Box3(new T.Vector3(hp.x - 0.095 * k, hp.y - 0.04 * k, hp.z - 0.105 * k), new T.Vector3(hp.x + 0.095 * k, hp.y + 0.18 * k, hp.z + 0.105 * k)); bb.translate(fw.multiplyScalar(0.03 * k));
    const c = bb.getCenter(new T.Vector3()), s = bb.getSize(new T.Vector3()); const HM = new T.MeshStandardMaterial({ color: o.hair || '#2a1a10', roughness: 0.85 });
    const g = new T.Group(); const r = Math.max(s.x, s.z) * 0.64; const style = o.hairStyle || (o.body === 'f' ? 'long' : 'short');
    const cap = o.capless ? new T.Object3D() :  new T.Mesh(new T.SphereGeometry(r, 28, 18, 0, Math.PI * 2, 0, style === 'buzz' ? 1.25 : 1.4), HM); cap.scale.set(0.98, style === 'buzz' ? 0.85 : 0.95, 1.1); cap.position.set(0, s.y * 0.0, s.z * 0.02); cap.rotation.x = 0.12; g.add(cap);
    if (style === 'long') { const back = new T.Mesh(new T.CapsuleGeometry(r * 0.82, s.y * 0.9, 6, 16), HM); back.scale.set(1.05, 1, 0.55); back.position.set(0, -s.y * 0.25, -s.z * 0.32); g.add(back); }
    if (style === 'bun') { const bun = new T.Mesh(new T.SphereGeometry(r * 0.42, 16, 12), HM); bun.position.set(0, s.y * 0.38, -s.z * 0.42); g.add(bun); }
    g.position.copy(c); g.updateMatrixWorld(true); head.attach(g); g.traverse((n) => { if (n.isMesh) n.castShadow = true; }); };
  // ---------- Toy human kit v2 (LIB.toyHuman): our own plastic toy people, built in three.js (no model files, nothing to license).
  // Glossy vinyl look, big head, painted face that blinks, ball joints, mitten hands. It honours the reel's own colours
  // (top, bottom, shoes, hair, hairStyle, skin), which the Kenney minis ignored. o.hairStyle: short buzz long bun pony curly bald.
  // out.pose(move, t) covers every move the toy reels use (idle talk sit sittalk dance clap attack hit push interact pickup walk
  // walkslow run sprint gallop crouch crouchwalk kneel eat headlow hithead jump death); unknown moves fall back to idle.
  // A reel turns it on with  window.TOY_HUMANS = 2  (before TOY/STORY), or the harness sets LIB.humanKit = 'toy2' for every reel.
  const SKINS = ['#f2c9a4', '#e3ad82', '#c98d5e', '#a8703f', '#7d4f2e', '#f6d7bd'];
  LIB.toyHuman = (o = {}) => { const g = new T.Group(), root = new T.Group(); g.add(root); const fem = o.body === 'f' || /^woman_/.test(o.body || '');
    const key = [o.top, o.bottom, o.hair, o.hairStyle, o.body].join('|'); let hsh = 7; for (const ch of key) hsh = (hsh * 31 + ch.charCodeAt(0)) >>> 0;
    const shade = (c) => { const col = new T.Color(c).convertSRGBToLinear(); if (o.shade) col.multiplyScalar(o.shade); return col; }; // hex colours are sRGB; without this the plastic looks washed out
    const P = (c, r = 0.32, cc = 0.55) => new T.MeshPhysicalMaterial({ color: shade(c), roughness: r, clearcoat: cc, clearcoatRoughness: 0.25 });
    const SK = P(o.skin || SKINS[hsh % SKINS.length], 0.45, 0.3), TOP = o.topless ? SK : P(o.top || '#3a5f8a'), BOT = P(o.bottom || '#2a2f3a'), SH = P(o.shoes || '#1d1d1f', 0.3), HR = P(o.hair || '#2a1a10', 0.55, 0.2), JT = P('#2a2a30', 0.4, 0.3);
    const cap = (r, l, m) => new T.Mesh(new T.CapsuleGeometry(r, l, 6, 14), m), sph = (r, m, w = 22) => new T.Mesh(new T.SphereGeometry(r, w, Math.round(w * 0.7)), m);
    // unit figure: 1.0 tall, feet on y = 0, facing +z
    const hips = new T.Group(); hips.position.y = 0.36; root.add(hips);
    const pelvis = new T.Mesh(new T.CylinderGeometry(0.105, 0.095, 0.07, 20), BOT); pelvis.position.y = 0.01; hips.add(pelvis);
    const legs = [-1, 1].map((sx) => { const L = new T.Group(); L.position.set(sx * 0.055, 0, 0); hips.add(L); const jt = sph(0.045, JT, 12); L.add(jt); const th = cap(0.05, 0.1, BOT); th.position.y = -0.085; L.add(th);
      const K = new T.Group(); K.position.y = -0.17; L.add(K); const sh = cap(0.045, 0.09, BOT); sh.position.y = -0.075; K.add(sh); const ft = sph(0.06, SH); ft.scale.set(0.95, 0.6, 1.5); ft.position.set(0, -0.155, 0.03); K.add(ft); L.userData.knee = K; return L; });
    const torso = new T.Group(); torso.position.y = 0.03; hips.add(torso); const chest = new T.Mesh(new T.CylinderGeometry(fem ? 0.1 : 0.115, 0.1, 0.2, 22), TOP); chest.position.y = 0.13; torso.add(chest);
    const sho = sph(fem ? 0.1 : 0.115, TOP); sho.scale.set(1, 0.45, 0.9); sho.position.y = 0.23; torso.add(sho); chest.scale.z = 0.8; sho.scale.z = 0.75;
    if (fem && !o.topless) { const sk = new T.Mesh(new T.CylinderGeometry(0.1, 0.15, 0.13, 22, 1, true), new T.MeshPhysicalMaterial({ color: shade(o.bottom || '#2a2f3a'), roughness: 0.35, clearcoat: 0.5, side: T.DoubleSide })); sk.position.y = -0.03; sk.scale.z = 0.85; torso.add(sk); }
    const arms = [-1, 1].map((sx) => { const A = new T.Group(); A.position.set(sx * (fem ? 0.125 : 0.14), 0.215, 0); torso.add(A); const jt = sph(0.042, JT, 12); A.add(jt); const up = cap(0.036, 0.075, TOP); up.position.y = -0.07; A.add(up);
      const E = new T.Group(); E.position.y = -0.135; A.add(E); const fo = cap(0.033, 0.07, o.sleeves === 'short' || o.topless ? SK : TOP); fo.position.y = -0.06; E.add(fo); const hd = sph(0.043, SK); hd.scale.set(0.8, 1, 1); hd.position.y = -0.13; E.add(hd); A.userData.elbow = E; A.userData.hand = hd; A.rotation.z = sx * 0.1; return A; });
    const neck = new T.Mesh(new T.CylinderGeometry(0.035, 0.04, 0.05, 12), SK); neck.position.y = 0.265; torso.add(neck);
    const head = new T.Group(); head.position.y = 0.28; torso.add(head); const R = 0.165; const skull = sph(R, SK, 30); skull.scale.set(1, 0.95, 0.96); skull.position.y = R; head.add(skull);
    [-1, 1].forEach((sx) => { const ear = sph(0.035, SK, 10); ear.scale.set(0.5, 1, 0.8); ear.position.set(sx * R * 0.97, R * 0.95, 0); head.add(ear); });
    const INK = new T.MeshBasicMaterial({ color: '#17131a' }), WH = new T.MeshBasicMaterial({ color: '#ffffff' });
    const eyes = [-1, 1].map((sx) => { const e = sph(0.026, INK, 14); e.scale.set(0.85, 1.25, 0.45); e.position.set(sx * 0.06, R * 1.02, R * 0.9); head.add(e); const hl = sph(0.008, WH, 8); hl.position.set(sx * 0.06 + 0.008, R * 1.02 + 0.012, R * 0.9 + 0.012); head.add(hl); e.userData.hl = hl;
      if (fem) { const ls = cap(0.004, 0.03, INK); ls.rotation.z = PI / 2 + sx * 0.5; ls.position.set(sx * 0.08, R * 1.02 + 0.03, R * 0.9); head.add(ls); } return e; });
    const brows = [-1, 1].map((sx) => { const b = cap(0.006, 0.035, HR); b.rotation.z = PI / 2; b.position.set(sx * 0.06, R * 1.34, R * 0.86); head.add(b); return b; });
    const smile = new T.Mesh(new T.TorusGeometry(0.03, 0.007, 6, 14, PI), INK); smile.rotation.z = PI; smile.position.set(0, R * 0.66, R * 0.92); head.add(smile);
    const mouth = sph(0.028, new T.MeshBasicMaterial({ color: '#5a1a1a' }), 12); mouth.scale.set(1.2, 0.8, 0.4); mouth.position.set(0, R * 0.62, R * 0.92); head.add(mouth); mouth.visible = false;
    [-1, 1].forEach((sx) => { const ck = new T.Mesh(new T.CircleGeometry(0.024, 14), new T.MeshBasicMaterial({ color: '#ff8a8a', transparent: true, opacity: 0.4 })); ck.position.set(sx * 0.1, R * 0.8, R * 0.87); ck.rotation.y = sx * 0.55; head.add(ck); });
    const st = o.hairStyle || (fem ? ['long', 'bun', 'pony', 'curly'][hsh % 4] : ['short', 'short', 'curly', 'buzz'][hsh % 4]);
    if (st !== 'bald' && st !== 'none') { if (st === 'curly') { for (let i = 0; i < 34; i++) { const a = i * 2.399, z = 1 - (i / 34) * 1.15, r0 = Math.sqrt(Math.max(0, 1 - z * z)); const b = sph(0.045, HR, 9); b.position.set(Math.cos(a) * r0 * R, R + z * R * 0.98, Math.sin(a) * r0 * R - 0.015); if (b.position.z > R * 0.5 && b.position.y < R * 1.45) continue; head.add(b); } }
      else { const c = new T.Mesh(new T.SphereGeometry(R * (st === 'buzz' ? 1.02 : 1.07), 28, 18, 0, PI * 2, 0, PI * (st === 'buzz' ? 0.42 : 0.52)), HR); c.position.set(0, R * 1.04, -0.012); c.rotation.x = -0.5; head.add(c); if (st !== 'buzz') { const fr = sph(0.055, HR, 12); fr.scale.set(1.7, 0.55, 0.8); fr.position.set(0.035, R * 1.62, R * 0.66); fr.rotation.z = 0.25; head.add(fr); } }
      if (st === 'long') { const bk = sph(R * 1.02, HR); bk.scale.set(1.02, 1.45, 0.6); bk.position.set(0, R * 0.62, -R * 0.42); head.add(bk); [-1, 1].forEach((sx) => { const sd = cap(0.045, 0.2, HR); sd.position.set(sx * R * 0.92, R * 0.6, -0.02); head.add(sd); }); }
      if (st === 'bun') { const bn = sph(0.065, HR); bn.position.set(0, R * 2.02, -0.04); head.add(bn); }
      if (st === 'pony') { const pn = cap(0.04, 0.16, HR); pn.position.set(0, R * 1.1, -R * 1.1); pn.rotation.x = 0.4; head.add(pn); } }
    g.traverse((n) => { if (n.isMesh) { n.castShadow = true; n.receiveShadow = true; n.frustumCulled = false; } });
    const H = (o.h || (fem ? 1.7 : 1.78)) * (LIB.miniScale || 0.8); root.scale.setScalar(H); g.userData.toy2 = true; g.userData.headH = H * 0.98;
    const seed = (hsh % 97) * 0.13, aL = arms[0], aR = arms[1], lL = legs[0], lR = legs[1];
    const reset = () => { root.position.set(0, 0, 0); root.rotation.set(0, 0, 0); hips.position.y = 0.36; hips.rotation.set(0, 0, 0); torso.rotation.set(0, 0, 0); head.rotation.set(0, 0, 0);
      arms.forEach((A, i) => { A.rotation.set(0, 0, (i ? 1 : -1) * 0.1); A.userData.elbow.rotation.set(0, 0, 0); }); legs.forEach((L) => { L.rotation.set(0, 0, 0); L.userData.knee.rotation.set(0, 0, 0); }); mouth.visible = false; smile.visible = true; };
    const gait = (t, f, amp, bob) => { legs.forEach((L, i) => { const ph = Math.sin(t * f + i * PI); L.rotation.x = ph * amp; L.userData.knee.rotation.x = Math.max(0, -ph) * amp * 1.4; }); arms.forEach((A, i) => { A.rotation.x = -Math.sin(t * f + i * PI) * amp * 0.9; A.userData.elbow.rotation.x = -0.35; }); hips.position.y = 0.36 + Math.abs(Math.sin(t * f)) * bob; torso.rotation.x = amp * 0.15; };
    const sitDown = () => { legs.forEach((L) => { L.rotation.x = -1.5; L.userData.knee.rotation.x = 1.5; }); hips.position.y = 0.2; };
    const talkFace = (t) => { mouth.visible = true; smile.visible = false; mouth.scale.y = 0.35 + Math.abs(Math.sin(t * 13) * Math.sin(t * 5.3)) * 1.1; head.rotation.x = Math.sin(t * 7) * 0.05; };
    g.pose = (move = 'idle', t = 0) => { reset(); const tt = t + seed; const blink = (tt % 3.4) < 0.11; eyes.forEach((e) => { e.scale.y = blink ? 0.12 : 1.25; e.userData.hl.visible = !blink; });
      hips.position.y += Math.sin(tt * 2.1) * 0.004; head.rotation.y = Math.sin(tt * 0.6) * 0.1; head.rotation.z = Math.sin(tt * 0.8) * 0.03; arms.forEach((A, i) => { A.rotation.x = Math.sin(tt * 1.3 + i) * 0.05; });
      switch (move) {
        case 'talk': talkFace(tt); aR.rotation.x = -0.7 + Math.sin(tt * 4) * 0.3; aR.userData.elbow.rotation.x = -0.9; aL.rotation.x = -0.2 - Math.sin(tt * 4) * 0.15; break;
        case 'sit': case 'sitdown': sitDown(); arms.forEach((A) => { A.rotation.x = -0.5; A.userData.elbow.rotation.x = -0.6; }); break;
        case 'sittalk': sitDown(); talkFace(tt); aR.rotation.x = -0.9 + Math.sin(tt * 4) * 0.25; aR.userData.elbow.rotation.x = -0.9; aL.rotation.x = -0.5; break;
        case 'dance': hips.position.y += Math.abs(Math.sin(tt * 6)) * 0.03; hips.rotation.y = Math.sin(tt * 3) * 0.35; torso.rotation.z = Math.sin(tt * 6) * 0.12; arms.forEach((A, i) => { A.rotation.z = (i ? 1 : -1) * (2.3 + Math.sin(tt * 6 + i * PI) * 0.5); A.userData.elbow.rotation.x = -0.5; }); legs.forEach((L, i) => { L.rotation.x = Math.sin(tt * 6 + i * PI) * 0.25; }); break;
        case 'clap': arms.forEach((A, i) => { A.rotation.x = -1.3; A.rotation.z = (i ? -1 : 1) * (0.25 + Math.abs(Math.sin(tt * 9)) * 0.3); A.userData.elbow.rotation.x = -0.7; }); hips.position.y += Math.abs(Math.sin(tt * 9)) * 0.008; break;
        case 'attack': case 'hit': case 'push': { const u = (Math.sin(tt * 7) + 1) / 2; aR.rotation.x = -0.6 - u * 1.3; aR.userData.elbow.rotation.x = -1.2 + u * 1.1; torso.rotation.y = -0.35 + u * 0.6; aL.rotation.x = -0.6; aL.userData.elbow.rotation.x = -1.3; lL.rotation.x = -0.25; lR.rotation.x = 0.25; if (move === 'push') { aL.rotation.x = aR.rotation.x = -1.4; aL.userData.elbow.rotation.x = aR.userData.elbow.rotation.x = -0.2; torso.rotation.x = 0.3; } } break;
        case 'interact': aR.rotation.x = -1.2 + Math.sin(tt * 3) * 0.15; aR.userData.elbow.rotation.x = -0.5; break;
        case 'pickup': { const u = (Math.sin(tt * 2.5) + 1) / 2; torso.rotation.x = u * 0.9; legs.forEach((L) => { L.rotation.x = -u * 0.5; L.userData.knee.rotation.x = u * 0.9; }); hips.position.y -= u * 0.06; aR.rotation.x = -0.6 - u * 0.6; } break;
        case 'walk': gait(tt, 6, 0.5, 0.012); break; case 'walkslow': case 'formalwalk': gait(tt, 3.6, 0.35, 0.008); break;
        case 'run': case 'sprint': case 'gallop': case 'swim': gait(tt, 11, 0.85, 0.03); torso.rotation.x = 0.25; break;
        case 'crouch': legs.forEach((L) => { L.rotation.x = -1.1; L.userData.knee.rotation.x = 1.9; }); hips.position.y = 0.2; torso.rotation.x = 0.45; arms.forEach((A) => { A.rotation.x = -0.6; }); break;
        case 'crouchwalk': gait(tt, 5, 0.35, 0.006); legs.forEach((L) => { L.rotation.x -= 0.7; L.userData.knee.rotation.x += 1.2; }); hips.position.y = 0.25; torso.rotation.x = 0.5; break;
        case 'kneel': lL.rotation.x = -1.5; lL.userData.knee.rotation.x = 1.5; lR.rotation.x = 0.1; lR.userData.knee.rotation.x = 1.5; hips.position.y = 0.21; head.rotation.x = 0.15; break;
        case 'eat': aR.rotation.x = -1.7 + Math.sin(tt * 5) * 0.25; aR.userData.elbow.rotation.x = -1.9; aR.rotation.z = -0.25; mouth.visible = true; smile.visible = false; mouth.scale.y = 0.5 + Math.abs(Math.sin(tt * 5)) * 0.8; break;
        case 'headlow': head.rotation.x = 0.55; torso.rotation.x = 0.15; arms.forEach((A) => { A.rotation.x = 0.05; }); break;
        case 'hithead': aR.rotation.x = -2.6; aR.userData.elbow.rotation.x = -1.6; aR.rotation.z = -0.3; head.rotation.z = 0.15; break;
        case 'jump': { const u = Math.abs(Math.sin(tt * 4.5)); root.position.y = u * 0.28 * H; legs.forEach((L) => { L.rotation.x = -u * 0.5; L.userData.knee.rotation.x = u * 0.9; }); arms.forEach((A, i) => { A.rotation.z = (i ? 1 : -1) * (0.3 + u * 2); }); } break;
        case 'death': root.rotation.x = -PI / 2; root.position.y = 0.09 * H; arms.forEach((A, i) => { A.rotation.z = (i ? 1 : -1) * 1.1; }); eyes.forEach((e) => { e.scale.y = 0.12; e.userData.hl.visible = false; }); smile.rotation.z = 0; break;
        default: break; }
      if (move !== 'death') smile.rotation.z = PI; };
    g.bone = (b) => ({ head, torso, hips, 'arm-left': aL, 'arm-right': aR, 'leg-left': lL, 'leg-right': lR, hand: aR.userData.hand, 'hand-right': aR.userData.hand, 'hand-left': aL.userData.hand })[b] || null;
    g.pose('idle', 0); return g; };
  LIB.human = (o = {}) => { o = Object.assign({ body: 'm', top: '#3a5f8a', bottom: '#2a2f3a', shoes: '#1d1d1f', sleeves: 'long', legs: 'long' }, o);
    if ((LIB.humanKit === 'toy2' || (typeof window !== 'undefined' && window.TOY_HUMANS === 2)) && !o.real && (o.body === 'm' || o.body === 'f' || /^woman_/.test(o.body))) return LIB.toyHuman(o);
    if (/^elite:/.test(o.body)) { const g = get('elite/' + o.body.slice(6)); const inner = T.SkeletonUtils.clone(g.scene); // Elites Endgame cast (Quaternius Ultimate Modular Men/Women, CC0): a look apart from the toy channel
      inner.traverse((m) => { if (m.isMesh) { m.castShadow = true; m.receiveShadow = true; m.material = m.material.clone(); const c = o.colors && o.colors[m.material.name]; if (c) m.material.color.set(c); if (o.shade) m.material.color.multiplyScalar(o.shade); } if (/pistol|sword|gun/i.test(m.name || '') && !o.armed) m.visible = false; }); // o.armed: keep the pack's pistol (gangsters)
      const out = wrap(inner, { h: o.h || 1.75 }); const clips = Object.fromEntries(g.animations.map((c) => [c.name.split('|').pop(), c])); out.pose = poser(inner, clips, EMOVES); out.mats = () => { const n = new Set(); inner.traverse((m) => { if (m.isMesh) n.add(m.material.name); }); return [...n]; }; out.pose('idle', 0); return out; }
    { const minis = Object.keys(LIB.gltf).filter((n) => n.startsWith('mini/')); const g0 = /^woman_/.test(o.body) || o.body === 'f' ? 'f' : 'm';
      if (minis.length && !o.real && (o.body === 'm' || o.body === 'f' || /^woman_/.test(o.body))) { const pool = minis.filter((n) => n.startsWith('mini/' + (g0 === 'f' ? 'female' : 'male'))).sort(); // sorted: assets load in a different order in each render worker (that made characters flicker)
        const name = o.look ? 'mini/' + (g0 === 'f' ? 'female-' : 'male-') + o.look : pool[(() => { const key = [o.top, o.bottom, o.hair, o.skin, o.hairStyle].join('|'); if (key === '||||') return 0; let h = 7; for (const ch of key) h = (h * 31 + ch.charCodeAt(0)) >>> 0; return h; })() % pool.length]; const g = get(name); const inner = T.SkeletonUtils.clone(g.scene);
        inner.traverse((m) => { if (m.isMesh) { m.castShadow = true; m.receiveShadow = true; m.material = m.material.clone(); m.material.roughness = 0.55; if (m.material.map) { m.material.map.magFilter = T.NearestFilter; } if (o.shade) m.material.color.multiplyScalar(o.shade); } });
        const out = wrap(inner, { h: (o.h || (g0 === 'f' ? 1.7 : 1.78)) * (LIB.miniScale || 0.8) }); out.pose = poser(inner, Object.fromEntries(g.animations.map((c) => [c.name, c])), KMOVES); out.bone = (b) => { let f = null; inner.traverse((x) => { if (x.isBone && x.name === b) f = x; }); return f; }; out.pose('idle', 0); return out; } }
    if (/^woman_/.test(o.body)) { const n = 'humans/' + o.body.replace(/^woman_(\w)/, (m, c) => 'Woman_' + c.toUpperCase()).replace('Tanktop', 'TankTop'); const g = get(n); const inner = T.SkeletonUtils.clone(g.scene);
      const out = wrap(inner, { h: o.h || 1.7 }); const clips = Object.fromEntries(g.animations.map((c) => [c.name.split('|').pop(), c])); out.pose = poser(inner, clips, WMOVES); out.pose('idle', 0); return out; }
    const n = o.body === 'f' ? 'humans/Superhero_Female' : (o.light && LIB.gltf['humans/Superhero_Male_Light'] ? 'humans/Superhero_Male_Light' : 'humans/Superhero_Male'); const inner = T.SkeletonUtils.clone(get(n).scene); let body = null;
    inner.traverse((m) => { if (m.isSkinnedMesh && (!body || m.geometry.attributes.position.count > body.geometry.attributes.position.count)) body = m; });
    let eyes = null; inner.traverse((m) => { if (m.isSkinnedMesh && /eye/i.test(m.name) && !/brow/i.test(m.name)) { m.geometry.computeBoundingBox(); eyes = m.geometry.boundingBox.getCenter(new T.Vector3()); } }); o.eyes = eyes;
    dress(body, o); const out = wrap(inner, { h: o.h || 1.78 }); out.pose = poser(inner, ual(), MOVES); out.pose('idle', 0); out.updateMatrixWorld(true); // hair is painted on the head in dress() (hairOn's cap meshes looked like bowls)
    out.bone = (b) => { let f = null; inner.traverse((x) => { if (x.isBone && x.name === b) f = x; }); return f; }; return out; };
  LIB.animal = (name, o = {}) => { const g = get('animals/' + name); const inner = T.SkeletonUtils.clone(g.scene); const out = wrap(inner, { h: o.h || ({ horse: 1.7, horse_white: 1.7, cow: 1.5, bull: 1.6, deer: 1.3, stag: 1.6, alpaca: 1.8, donkey: 1.3, sheep: 1.0, dog: 0.55, husky: 0.6, fox: 0.45, wolf: 0.8 })[name] || 1 });
    const clips = {}; g.animations.forEach((c) => { const k = c.name.split('|').pop(); if (!clips[k] || c.name.includes('|')) clips[k] = c; }); const map = Object.fromEntries(Object.entries(AMOVES).map(([k, c]) => [k, c.find((x) => clips[x]) || 'Idle'])); out.moves = Object.keys(clips); out.pose = poser(inner, clips, map); out.pose('idle', 0); return out; };
  LIB.list = () => ['humans: m f woman_casual woman_dress woman_jacket woman_tanktop', 'animals: ' + Object.keys(AMOVES).length + ' moves, ' + 'alpaca bull cow deer dog donkey fox horse horse_white husky sheep stag wolf', 'props/nature/buildings: see assets/LICENSES.md'].join('\n');
  // ---------- places (primitives + models). Each returns a Group with .spots and .cam ----------
  const M = (c, r = 0.7, m = 0, x = {}) => new T.MeshStandardMaterial(Object.assign({ color: c, roughness: r, metalness: m }, x));
  const box = (p, w, h, d, m, x, y, z) => { const o = new T.Mesh(new T.BoxGeometry(w, h, d), m); o.position.set(x, y, z); o.castShadow = o.receiveShadow = true; p.add(o); return o; };
  const ctex = (w, h, f) => { const c = document.createElement('canvas'); c.width = w; c.height = h; f(c.getContext('2d'), w, h); const t = new T.CanvasTexture(c); t.wrapS = t.wrapT = T.RepeatWrapping; t.encoding = T.sRGBEncoding; return t; };
  const planks = (a, b) => ctex(256, 256, (c, w, h) => { c.fillStyle = a; c.fillRect(0, 0, w, h); for (let i = 0; i < 8; i++) { c.fillStyle = i % 2 ? b : a; c.fillRect(0, i * 32, w, 31); c.fillStyle = 'rgba(0,0,0,0.25)'; c.fillRect(0, i * 32 + 31, w, 1); } });
  const tiles = (a, b, n = 8) => ctex(256, 256, (c, w, h) => { for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) { c.fillStyle = (i + j) % 2 ? a : b; c.fillRect(i * w / n, j * h / n, w / n, h / n); } });
  const grassT = () => ctex(256, 256, (c, w, h) => { c.fillStyle = '#4f7d34'; c.fillRect(0, 0, w, h); for (let i = 0; i < 3000; i++) { c.fillStyle = ['#5f9440', '#456f2c', '#6aa04a'][i % 3]; c.fillRect((i * 73) % w, (i * 151 + i * i) % h, 2, 3); } });
  const ground = (p, size, tex, rep) => { tex.repeat.set(rep, rep); const g = new T.Mesh(new T.PlaneGeometry(size, size), M('#ffffff', 0.95, 0, { map: tex })); g.rotation.x = -Math.PI / 2; g.receiveShadow = true; p.add(g); return g; };
  const add = (p, o, x, y, z, ry = 0) => { o.position.set(x, y, z); o.rotation.y = ry; p.add(o); return o; };
  const has = (n) => !!LIB.gltf[n];
  const P = LIB.place = {};
  // ---------- Kenney toy dressing (CC0 Furniture / City / Car / Nature kits, assets khome/* ktown/* knature/*). Matches the Kenney Mini toy cast.
  // Used automatically by room / kitchen / office / street / park / village when the reel loads those assets (LIB.toyKit adds them all).
  const KH = {"bookcaseOpen": 2.1, "pottedPlant": 1.3, "lampRoundFloor": 1.9, "rugRound": 0.03, "cabinetTelevision": 0.7, "televisionModern": 0.75, "sideTable": 0.7, "books": 0.25, "kitchenFridge": 2.0, "kitchenCabinet": 1.0, "kitchenSink": 1.0, "kitchenStove": 1.0, "trashcan": 0.6, "bookcaseClosedWide": 2.0, "coatRackStanding": 1.8, "cardboardBoxClosed": 0.5, "bedDouble": 0.75, "rugRectangle": 0.03}; // real heights for the furniture (the kit's own sizes vary)
  const KP = (n, sc, x, y, z, ry = 0, g) => { if (!has(n)) return null; const hh = KH[n.split('/')[1]]; const o = LIB.prop(n, n.startsWith('khome/') && hh ? (hh < 0.1 ? { w: 2.6 } : { h: hh * 1.15 }) : { scale: sc }); o.position.set(x, y, z); o.rotation.y = ry; g.add(o); return o; };
  const kenneyOn = () => has('khome/loungeSofa') || has('ktown/building-a') || has('knature/tree_oak');
  LIB.toyKitAssets = () => [...['loungeSofa', 'loungeChair', 'tableCoffee', 'rugRectangle', 'rugRound', 'cabinetTelevision', 'televisionModern', 'lampRoundFloor', 'pottedPlant', 'plantSmall1', 'bookcaseOpen', 'bookcaseClosedWide', 'sideTable', 'books',
      'kitchenFridge', 'kitchenStove', 'kitchenCabinet', 'kitchenSink', 'kitchenBar', 'stoolBar', 'desk', 'chairDesk', 'computerScreen', 'computerKeyboard', 'laptop', 'trashcan', 'coatRackStanding', 'bedDouble', 'cardboardBoxClosed', 'speaker'].map((n) => 'khome/' + n),
    ...['a', 'c', 'e', 'h', 'k', 'm', 'o', 'q', 's', 't'].map((n) => 'ktown/building-' + n), 'ktown/car-sedan', 'ktown/car-taxi', 'ktown/car-van', 'ktown/car-suv', 'ktown/light-curved', 'ktown/planter', 'ktown/construction-cone', 'ktown/detail-parasol-a',
    ...['tree_oak', 'tree_default', 'tree_fat', 'tree_pineRoundA', 'plant_bush', 'plant_bushLarge', 'flower_redA', 'flower_yellowA', 'flower_purpleA', 'rock_largeA', 'mushroom_red', 'log', 'fence_simple', 'grass_large'].map((n) => 'knature/' + n)];
  const S = 2.0; // furniture scale next to the 1.4-tall toy cast
  const dressRoom = (g, o) => { if (!kenneyOn() || o.bare) return; const bw = -o.d / 2 + 0.05, L = -o.w / 2 + 0.05, R = o.w / 2 - 0.05;
    // wainscot + skirting so walls are not flat
    const WS = M(new T.Color(o.wall).multiplyScalar(0.78).getStyle(), 0.8); box(g, o.w, 0.9, 0.04, WS, 0, 0.45, bw + 0.04); box(g, 0.04, 0.9, o.d, WS, L + 0.04, 0.45, 0); box(g, 0.04, 0.9, o.d, WS, R - 0.04, 0.45, 0);
    box(g, o.w, 0.05, 0.06, M('#ffffff', 0.5), 0, 0.92, bw + 0.06);
    const pic = box(g, 0.8, 0.6, 0.03, M(['#e8a33a', '#3a8ad8', '#d8503a', '#4ab07a'][(o.seed || 0) % 4], 0.6), o.w / 4, 1.75, bw + 0.04); box(g, 0.9, 0.7, 0.02, M('#2a2a2a', 0.5), o.w / 4, 1.75, bw + 0.02);
    const kind = o.kind || 'living';
    if (kind === 'living') { KP('khome/bookcaseOpen', S, L + 0.35, 0, bw + 0.25, Math.PI / 2, g) || null; KP('khome/pottedPlant', S, R - 0.4, 0, bw + 0.4, 0, g); KP('khome/lampRoundFloor', S, L + 0.4, 0, o.d / 2 - 0.8, 0, g); KP('khome/rugRound', S * 1.6, 0, 0.005, 0.2, 0, g);
      KP('khome/cabinetTelevision', S, R - 0.35, 0, -0.4, -Math.PI / 2, g); KP('khome/televisionModern', S, R - 0.35, 0.62, -0.4, -Math.PI / 2, g); KP('khome/sideTable', S, -o.w / 4 - 0.9, 0, bw + 0.35, 0, g); KP('khome/books', S, -o.w / 4 - 0.9, 0.55, bw + 0.35, 0.4, g); }
    if (kind === 'kitchen') { [['khome/kitchenFridge', -2.5], ['khome/kitchenCabinet', -1.75], ['khome/kitchenSink', -1.05], ['khome/kitchenStove', -0.35], ['khome/kitchenCabinet', 0.35]].forEach(([n, x]) => KP(n, S, x, 0, bw + 0.35, 0, g));
      KP('khome/pottedPlant', S, R - 0.4, 0, bw + 0.4, 0, g); KP('khome/trashcan', S, L + 0.35, 0, 0.6, 0, g); }
    if (kind === 'office') { KP('khome/bookcaseClosedWide', S, -0.8, 0, bw + 0.2, 0, g); KP('khome/bookcaseClosedWide', S, 0.4, 0, bw + 0.2, 0, g); KP('khome/pottedPlant', S, R - 0.4, 0, bw + 0.4, 0, g); KP('khome/coatRackStanding', S, L + 0.4, 0, bw + 0.5, 0, g); KP('khome/trashcan', S, L + 0.5, 0, 0.8, 0, g); KP('khome/cardboardBoxClosed', S, R - 0.5, 0, 1.0, 0.3, g); }
    if (kind === 'bedroom') { KP('khome/bedDouble', S, 0.8, 0, bw + 1.1, 0, g); KP('khome/sideTable', S, -0.6, 0, bw + 0.3, 0, g); KP('khome/lampRoundFloor', S, R - 0.4, 0, bw + 0.4, 0, g); KP('khome/rugRectangle', S, 0, 0.005, 0.8, 0, g); } };
  const dressOutdoor = (g, kind, o = {}) => { if (!kenneyOn()) return; const TR = ['knature/tree_oak', 'knature/tree_default', 'knature/tree_fat', 'knature/tree_pineRoundA'].filter(has), FL = ['knature/flower_redA', 'knature/flower_yellowA', 'knature/flower_purpleA', 'knature/plant_bush', 'knature/grass_large'].filter(has);
    const R = (i) => ((i * 9301 + 49297) % 233280) / 233280;
    if (kind === 'park' || kind === 'village') { for (let i = 0; i < 12 && TR.length; i++) { const sd = i % 2 ? 1 : -1; KP(TR[i % TR.length], 4.2 + R(i) * 1.6, sd * (6 + R(i + 3) * 8), 0, -24 + i * 2.2, R(i) * 6, g); }
      for (let i = 0; i < 40 && FL.length; i++) { const sd = i % 2 ? 1 : -1; KP(FL[i % FL.length], 1.4 + R(i) * 0.6, sd * (3 + R(i + 7) * 8), 0, -20 + R(i + 11) * 22, R(i) * 6, g); }
      if (kind === 'park') { KP('knature/rock_largeA', 2.2, -4.2, 0, -4, 0.6, g); KP('knature/log', 2.2, 4.4, 0, -6, 0.9, g); KP('knature/mushroom_red', 2, -3.4, 0, -2.2, 0, g); } }
    if (kind === 'street') { const B = ['a', 'c', 'e', 'h', 'k', 'm', 'o', 'q', 's', 't'].map((n) => 'ktown/building-' + n).filter(has); const len = o.len || 60;
      if (B.length) { g.children.slice().forEach((c) => { if (c.isMesh && c.geometry && c.geometry.parameters && c.geometry.parameters.width === 8.5) c.visible = false; }); // hide the plain box buildings
        [-1, 1].forEach((sd) => { for (let i = 0; i < len / 9; i++) { const b = KP(B[(i * 3 + (sd > 0 ? 5 : 0)) % B.length], 7, sd * 15.5, 0.18, -len / 2 + 4.5 + i * 9, sd > 0 ? -Math.PI / 2 : Math.PI / 2, g); } }); }
      const C = ['ktown/car-sedan', 'ktown/car-taxi', 'ktown/car-van', 'ktown/car-suv'].filter(has); for (let i = 0; i < 4 && C.length; i++) KP(C[i % C.length], 1.25, (i % 2 ? 1 : -1) * 2.4, 0, -len / 2 + 4 + i * 6, i % 2 ? Math.PI : 0, g); // parked far down the road, away from the action
      for (let z = -len / 2 + 8; z < 2; z += 12) { KP('ktown/planter', 1.4, 6.6, 0.18, z, 0, g); KP('ktown/planter', 1.4, -6.6, 0.18, z + 6, 0, g); if (TR.length) { KP(TR[0], 3.4, 6.7, 0.18, z + 3, 0, g); KP(TR[1 % TR.length], 3.4, -6.7, 0.18, z - 3, 0, g); } } } };
  LIB.dressRoom = dressRoom; LIB.dressOutdoor = dressOutdoor;
  P.room = (o = {}) => { o = Object.assign({ w: 6, d: 5, h: 2.8, wall: '#d9cbb3', floor: 'wood', window: true }, o); const g = new T.Group();
    ground(g, Math.max(o.w, o.d) * 2, o.floor === 'tiles' ? tiles('#e8e4dc', '#cfc8bc') : planks('#8a5a36', '#7a4e2e'), Math.max(o.w, o.d));
    const WM = M(o.wall, 0.9); box(g, o.w, o.h, 0.1, WM, 0, o.h / 2, -o.d / 2); box(g, 0.1, o.h, o.d, WM, -o.w / 2, o.h / 2, 0); box(g, 0.1, o.h, o.d, WM, o.w / 2, o.h / 2, 0);
    if (o.window) { box(g, 1.4, 1.1, 0.12, M('#bfe3ff', 0.1, 0, { emissive: '#bfe3ff', emissiveIntensity: 0.6 }), -o.w / 4, 1.6, -o.d / 2 + 0.02); box(g, 1.5, 0.08, 0.16, M('#f4f1ea'), -o.w / 4, 1.02, -o.d / 2 + 0.04); }
    const lamp = new T.PointLight('#ffe2b8', 0.8, 12, 2); lamp.position.set(0, o.h - 0.3, 0); g.add(lamp);
    dressRoom(g, o); g.spots = { center: [0, 0, 0], door: [o.w / 2 - 0.8, 0, o.d / 2 - 0.5], window: [-o.w / 4, 0, -o.d / 2 + 0.8] }; g.cam = { pos: [o.w * 0.35, 1.7, o.d * 0.9], look: [0, 1.1, 0], fov: 40 }; return g; };
  P.kitchen = (o = {}) => { const g = P.room(Object.assign({ floor: 'tiles', wall: '#e9e2d4', kind: 'kitchen' }, o)); const C = M('#f4f1ea', 0.5), TOP = M('#3b3b40', 0.3);
    box(g, 4, 0.9, 0.62, C, 0, 0.45, -2.15); box(g, 4.05, 0.05, 0.66, TOP, 0, 0.92, -2.15); box(g, 4, 0.7, 0.35, C, 0, 1.9, -2.3); box(g, 0.75, 1.8, 0.7, M('#cfd3d8', 0.3, 0.6), 2.4, 0.9, -2.1);
    g.spots.counter = [0, 0, -1.4]; return g; };
  P.office = (o = {}) => { const g = P.room(Object.assign({ wall: '#dfe4e8', floor: 'tiles', kind: 'office' }, o)); const D = M('#6b4a32', 0.5);
    for (let i = -1; i <= 1; i += 2) { box(g, 1.4, 0.05, 0.7, D, i * 1.4, 0.75, -0.6); box(g, 0.05, 0.75, 0.6, D, i * 1.4 - 0.65, 0.375, -0.6); box(g, 0.05, 0.75, 0.6, D, i * 1.4 + 0.65, 0.375, -0.6);
      box(g, 0.5, 0.32, 0.03, M('#111', 0.3, 0.2, { emissive: '#2a4a7a', emissiveIntensity: 0.6 }), i * 1.4, 0.95, -0.8); if (has('props/chair')) add(g, LIB.prop('props/chair', { h: 1.0 }), i * 1.4, 0, 0.05, Math.PI); }
    g.spots.desk = [-1.4, 0, 0.1]; g.spots.desk2 = [1.4, 0, 0.1]; return g; };
  P.courtroom = (o = {}) => { const g = P.room(Object.assign({ w: 9, d: 8, h: 4.2, wall: '#7a5638', window: false }, o)); const W = M('#5a3a22', 0.45), W2 = M('#6e4a2c', 0.5);
    box(g, 3.2, 1.3, 1.0, W, 0, 0.65, -3.0); box(g, 3.4, 0.4, 1.2, W, 0, 1.5, -3.3); box(g, 3.6, 0.08, 1.3, W2, 0, 1.3, -2.95); // judge's bench
    box(g, 1.4, 1.0, 0.6, W, -2.6, 0.5, -1.6); box(g, 1.6, 0.06, 0.7, W2, -2.6, 1.02, -1.6); // witness stand
    for (let i = 0; i < 2; i++) { box(g, 1.8, 0.75, 0.8, W2, i ? 1.6 : -1.6, 0.375, 0.6); } // lawyers' tables
    for (let r = 0; r < 3; r++) box(g, 7, 0.45, 0.5, W, 0, 0.225, 2.3 + r * 0.8); box(g, 8, 1.0, 0.08, W, 0, 0.5, 1.6); // gallery + bar
    const seal = new T.Mesh(new T.CylinderGeometry(0.38, 0.38, 0.05, 40), M('#8a6a2a', 0.4, 0.7)); seal.rotation.x = Math.PI / 2; seal.position.set(0, 3.3, -3.95); g.add(seal);
    g.spots = { judge: [0, 0.6, -3.6], witness: [-2.6, 0, -1.9], defense: [-1.6, 0, 1.2], prosecution: [1.6, 0, 1.2], gallery: [0, 0, 2.6] }; g.cam = { pos: [0, 2.4, 6.5], look: [0, 1.3, -2], fov: 42 }; return g; };
  P.cell = (o = {}) => { const g = new T.Group(); ground(g, 12, tiles('#7d8086', '#73767c', 6), 3); const CW = M('#9a9d9f', 0.95);
    box(g, 4, 3, 0.2, CW, 0, 1.5, -1.6); box(g, 0.2, 3, 3.4, CW, -2, 1.5, 0); box(g, 0.2, 3, 3.4, CW, 2, 1.5, 0);
    const BAR = M('#3a3c40', 0.35, 0.9); for (let i = 0; i < 16; i++) { const b = new T.Mesh(new T.CylinderGeometry(0.025, 0.025, 3, 8), BAR); b.position.set(-1.9 + i * 0.253, 1.5, 1.7); b.castShadow = true; g.add(b); } box(g, 4, 0.08, 0.08, BAR, 0, 2.2, 1.7);
    box(g, 1.9, 0.12, 0.8, M('#5b5f63', 0.6, 0.4), -1.0, 0.5, -1.15); box(g, 1.8, 0.12, 0.75, M('#c9c2ae', 0.95), -1.0, 0.6, -1.15); box(g, 0.45, 0.4, 0.45, M('#e8e8e8', 0.2), 1.5, 0.2, -1.2);
    const bulb = new T.PointLight('#ffe9c4', 0.9, 8, 2); bulb.position.set(0, 2.8, 0); g.add(bulb);
    g.spots = { bunk: [-1.0, 0.6, -1.0], bars: [0, 0, 1.3], center: [0, 0, 0] }; g.cam = { pos: [1.2, 1.6, 4.6], look: [0, 1.1, 0], fov: 40 }; return g; };
  P.park = (o = {}) => { o = Object.assign({ size: 40, trees: 9, seed: 3 }, o); const g = new T.Group(); ground(g, o.size, grassT(), o.size / 4);
    const path = new T.Mesh(new T.PlaneGeometry(2.2, o.size), M('#b8a888', 0.95)); path.rotation.x = -Math.PI / 2; path.position.y = 0.005; path.receiveShadow = true; g.add(path);
    const TR = ['nature/tree_oak', 'nature/tree_maple', 'nature/tree_birch'].filter(has); for (let i = 0; i < o.trees && TR.length; i++) { const side = i % 2 ? 1 : -1; const z = -o.size / 2 + 3 + (i * o.size * 0.9) / o.trees;
      add(g, LIB.prop(TR[(i + o.seed) % TR.length], { h: 6 + ((i * 7) % 3) }), side * (4 + ((i * 13) % 5)), 0, z, i); }
    if (has('props/bench')) add(g, LIB.prop('props/bench', { w: 1.8 }), 2.2, 0, 0, -Math.PI / 2); if (has('nature/rock_mossy')) add(g, LIB.prop('nature/rock_mossy', { h: 1.0 }), -3.0, 0, 3);
    dressOutdoor(g, 'park'); g.spots = { bench: [2.0, 0, 0], path: [0, 0, 0], far: [0, 0, -12] }; g.cam = { pos: [3.5, 1.6, 8], look: [0, 1.0, 0], fov: 40 }; g.sky = '#9fd3f2'; return g; };
  P.village = (o = {}) => { const g = new T.Group(); ground(g, 60, grassT(), 15); const H = ['buildings/cottage', 'buildings/village_house', 'buildings/house_v2'].filter(has);
    H.forEach((n, i) => add(g, LIB.prop(n, { h: 6 }), -9 + i * 9, 0, -8 - (i % 2) * 2, (i - 1) * 0.3)); if (has('buildings/well')) add(g, LIB.prop('buildings/well', { h: 2.6 }), 3, 0, -1);
    if (has('buildings/fence')) for (let i = 0; i < 5; i++) add(g, LIB.prop('buildings/fence', { w: 2.5 }), -10 + i * 2.5, 0, 2);
    const TR = ['nature/tree_oak', 'nature/tree_maple'].filter(has); for (let i = 0; i < 6 && TR.length; i++) add(g, LIB.prop(TR[i % TR.length], { h: 7 }), -16 + i * 6.5, 0, -16 - (i % 2) * 3, i);
    dressOutdoor(g, 'village'); g.spots = { well: [2, 0, 0.5], square: [0, 0, 0], door: [0, 0, -5] }; g.cam = { pos: [4, 2.2, 10], look: [0, 1.6, -4], fov: 42 }; g.sky = '#a8d8f0'; return g; };
  P.street = (o = {}) => { o = Object.assign({ len: 60, night: false }, o); const g = new T.Group(); const asph = ctex(128, 128, (c, w, h) => { c.fillStyle = '#3b3d42'; c.fillRect(0, 0, w, h); for (let i = 0; i < 900; i++) { c.fillStyle = i % 2 ? '#45474c' : '#33353a'; c.fillRect((i * 37) % w, (i * 91) % h, 2, 2); } });
    asph.repeat.set(2, o.len / 4); const road = new T.Mesh(new T.PlaneGeometry(8, o.len), M('#ffffff', 0.9, 0, { map: asph })); road.rotation.x = -Math.PI / 2; road.receiveShadow = true; g.add(road);
    for (let z = -o.len / 2; z < o.len / 2; z += 4) box(g, 0.15, 0.01, 2, M('#f2f2f2', 0.6), 0, 0.01, z);
    [-1, 1].forEach((s) => { box(g, 3, 0.18, o.len, M('#a9a7a2', 0.9), s * 5.5, 0.09, 0);
      for (let i = 0; i < o.len / 9; i++) { const hgt = 8 + ((i * 7 + (s > 0 ? 3 : 0)) % 4) * 4, col = ['#b7a48c', '#8f9aa3', '#c9b8a0', '#7d8a8f', '#a88f7a'][(i + (s > 0 ? 2 : 0)) % 5];
        const win = ctex(64, 128, (c, w, h) => { c.fillStyle = col; c.fillRect(0, 0, w, h); for (let y = 8; y < h; y += 16) for (let x = 6; x < w; x += 16) { c.fillStyle = o.night ? ((x * y) % 7 < 3 ? '#ffd27a' : '#1b2330') : '#5d7387'; c.fillRect(x, y, 9, 10); } });
        win.repeat.set(2, hgt / 4); box(g, 8.5, hgt, 8, M('#ffffff', 0.85, 0, { map: win, emissive: o.night ? '#ffffff' : '#000000', emissiveMap: o.night ? win : null, emissiveIntensity: o.night ? 0.35 : 0 }), s * 11.5, hgt / 2, -o.len / 2 + 4.5 + i * 9); }
      for (let z = -o.len / 2 + 5; z < o.len / 2; z += 12) { box(g, 0.12, 4.5, 0.12, M('#2b2d31', 0.4, 0.8), s * 4.4, 2.25, z); if (o.night) { const L = new T.PointLight('#ffd9a0', 1.2, 14, 2); L.position.set(s * 4.0, 4.4, z); g.add(L); } } });
    dressOutdoor(g, 'street', o); g.spots = { sidewalk: [5.2, 0.18, 0], road: [0, 0, 0], crossing: [0, 0, 8] }; g.cam = { pos: [2.5, 1.7, 14], look: [0, 2.0, -6], fov: 44 }; g.sky = o.night ? '#0d1424' : '#b9d9ef'; return g; };
})();
