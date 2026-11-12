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
  const T = THREE, BASE = 'https://kit.assets/';
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
    if (/lowerarm/.test(b)) return o.sleeves === 'short' ? 'skin' : 'top'; if (/upperarm/.test(b)) return o.sleeves === 'none' ? 'skin' : 'top';
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
  LIB.human = (o = {}) => { o = Object.assign({ body: 'm', top: '#3a5f8a', bottom: '#2a2f3a', shoes: '#1d1d1f', sleeves: 'long', legs: 'long' }, o);
    if (/^elite:/.test(o.body)) { const g = get('elite/' + o.body.slice(6)); const inner = T.SkeletonUtils.clone(g.scene); // Elites Endgame cast (Quaternius Ultimate Modular Men/Women, CC0): a look apart from the toy channel
      inner.traverse((m) => { if (m.isMesh) { m.castShadow = true; m.receiveShadow = true; m.material = m.material.clone(); const c = o.colors && o.colors[m.material.name]; if (c) m.material.color.set(c); if (o.shade) m.material.color.multiplyScalar(o.shade); } if (/pistol|sword|gun/i.test(m.name || '') && !o.armed) m.visible = false; }); // o.armed: keep the pack's pistol (gangsters)
      const out = wrap(inner, { h: o.h || 1.75 }); const clips = Object.fromEntries(g.animations.map((c) => [c.name.split('|').pop(), c])); out.pose = poser(inner, clips, EMOVES); out.mats = () => { const n = new Set(); inner.traverse((m) => { if (m.isMesh) n.add(m.material.name); }); return [...n]; }; out.pose('idle', 0); return out; }
    { const minis = Object.keys(LIB.gltf).filter((n) => n.startsWith('mini/')); const g0 = /^woman_/.test(o.body) || o.body === 'f' ? 'f' : 'm';
      if (minis.length && !o.real && (o.body === 'm' || o.body === 'f' || /^woman_/.test(o.body))) { const pool = minis.filter((n) => n.startsWith('mini/' + (g0 === 'f' ? 'female' : 'male')));
        const name = o.look ? 'mini/' + (g0 === 'f' ? 'female-' : 'male-') + o.look : pool[(() => { const key = [o.top, o.bottom, o.hair, o.skin, o.hairStyle].join('|'); if (key === '||||') return 0; let h = 7; for (const ch of key) h = (h * 31 + ch.charCodeAt(0)) >>> 0; return h; })() % pool.length]; const g = get(name); const inner = T.SkeletonUtils.clone(g.scene);
        inner.traverse((m) => { if (m.isMesh) { m.castShadow = true; m.receiveShadow = true; m.material = m.material.clone(); m.material.roughness = 0.55; if (m.material.map) { m.material.map.magFilter = T.NearestFilter; } if (o.shade) m.material.color.multiplyScalar(o.shade); } });
        const out = wrap(inner, { h: (o.h || (g0 === 'f' ? 1.7 : 1.78)) * (LIB.miniScale || 0.8) }); out.pose = poser(inner, Object.fromEntries(g.animations.map((c) => [c.name, c])), KMOVES); out.bone = (b) => { let f = null; inner.traverse((x) => { if (x.isBone && x.name === b) f = x; }); return f; }; out.pose('idle', 0); return out; } }
    if (/^woman_/.test(o.body)) { const n = 'humans/' + o.body.replace(/^woman_(\w)/, (m, c) => 'Woman_' + c.toUpperCase()).replace('Tanktop', 'TankTop'); const g = get(n); const inner = T.SkeletonUtils.clone(g.scene);
      const out = wrap(inner, { h: o.h || 1.7 }); const clips = Object.fromEntries(g.animations.map((c) => [c.name.split('|').pop(), c])); out.pose = poser(inner, clips, WMOVES); out.pose('idle', 0); return out; }
    const n = o.body === 'f' ? 'humans/Superhero_Female' : 'humans/Superhero_Male'; const inner = T.SkeletonUtils.clone(get(n).scene); let body = null;
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
  P.room = (o = {}) => { o = Object.assign({ w: 6, d: 5, h: 2.8, wall: '#d9cbb3', floor: 'wood', window: true }, o); const g = new T.Group();
    ground(g, Math.max(o.w, o.d) * 2, o.floor === 'tiles' ? tiles('#e8e4dc', '#cfc8bc') : planks('#8a5a36', '#7a4e2e'), Math.max(o.w, o.d));
    const WM = M(o.wall, 0.9); box(g, o.w, o.h, 0.1, WM, 0, o.h / 2, -o.d / 2); box(g, 0.1, o.h, o.d, WM, -o.w / 2, o.h / 2, 0); box(g, 0.1, o.h, o.d, WM, o.w / 2, o.h / 2, 0);
    if (o.window) { box(g, 1.4, 1.1, 0.12, M('#bfe3ff', 0.1, 0, { emissive: '#bfe3ff', emissiveIntensity: 0.6 }), -o.w / 4, 1.6, -o.d / 2 + 0.02); box(g, 1.5, 0.08, 0.16, M('#f4f1ea'), -o.w / 4, 1.02, -o.d / 2 + 0.04); }
    const lamp = new T.PointLight('#ffe2b8', 0.8, 12, 2); lamp.position.set(0, o.h - 0.3, 0); g.add(lamp);
    g.spots = { center: [0, 0, 0], door: [o.w / 2 - 0.8, 0, o.d / 2 - 0.5], window: [-o.w / 4, 0, -o.d / 2 + 0.8] }; g.cam = { pos: [o.w * 0.35, 1.7, o.d * 0.9], look: [0, 1.1, 0], fov: 40 }; return g; };
  P.kitchen = (o = {}) => { const g = P.room(Object.assign({ floor: 'tiles', wall: '#e9e2d4' }, o)); const C = M('#f4f1ea', 0.5), TOP = M('#3b3b40', 0.3);
    box(g, 4, 0.9, 0.62, C, 0, 0.45, -2.15); box(g, 4.05, 0.05, 0.66, TOP, 0, 0.92, -2.15); box(g, 4, 0.7, 0.35, C, 0, 1.9, -2.3); box(g, 0.75, 1.8, 0.7, M('#cfd3d8', 0.3, 0.6), 2.4, 0.9, -2.1);
    g.spots.counter = [0, 0, -1.4]; return g; };
  P.office = (o = {}) => { const g = P.room(Object.assign({ wall: '#dfe4e8', floor: 'tiles' }, o)); const D = M('#6b4a32', 0.5);
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
    g.spots = { bench: [2.0, 0, 0], path: [0, 0, 0], far: [0, 0, -12] }; g.cam = { pos: [3.5, 1.6, 8], look: [0, 1.0, 0], fov: 40 }; g.sky = '#9fd3f2'; return g; };
  P.village = (o = {}) => { const g = new T.Group(); ground(g, 60, grassT(), 15); const H = ['buildings/cottage', 'buildings/village_house', 'buildings/house_v2'].filter(has);
    H.forEach((n, i) => add(g, LIB.prop(n, { h: 6 }), -9 + i * 9, 0, -8 - (i % 2) * 2, (i - 1) * 0.3)); if (has('buildings/well')) add(g, LIB.prop('buildings/well', { h: 2.6 }), 3, 0, -1);
    if (has('buildings/fence')) for (let i = 0; i < 5; i++) add(g, LIB.prop('buildings/fence', { w: 2.5 }), -10 + i * 2.5, 0, 2);
    const TR = ['nature/tree_oak', 'nature/tree_maple'].filter(has); for (let i = 0; i < 6 && TR.length; i++) add(g, LIB.prop(TR[i % TR.length], { h: 7 }), -16 + i * 6.5, 0, -16 - (i % 2) * 3, i);
    g.spots = { well: [2, 0, 0.5], square: [0, 0, 0], door: [0, 0, -5] }; g.cam = { pos: [4, 2.2, 10], look: [0, 1.6, -4], fov: 42 }; g.sky = '#a8d8f0'; return g; };
  P.street = (o = {}) => { o = Object.assign({ len: 60, night: false }, o); const g = new T.Group(); const asph = ctex(128, 128, (c, w, h) => { c.fillStyle = '#3b3d42'; c.fillRect(0, 0, w, h); for (let i = 0; i < 900; i++) { c.fillStyle = i % 2 ? '#45474c' : '#33353a'; c.fillRect((i * 37) % w, (i * 91) % h, 2, 2); } });
    asph.repeat.set(2, o.len / 4); const road = new T.Mesh(new T.PlaneGeometry(8, o.len), M('#ffffff', 0.9, 0, { map: asph })); road.rotation.x = -Math.PI / 2; road.receiveShadow = true; g.add(road);
    for (let z = -o.len / 2; z < o.len / 2; z += 4) box(g, 0.15, 0.01, 2, M('#f2f2f2', 0.6), 0, 0.01, z);
    [-1, 1].forEach((s) => { box(g, 3, 0.18, o.len, M('#a9a7a2', 0.9), s * 5.5, 0.09, 0);
      for (let i = 0; i < o.len / 9; i++) { const hgt = 8 + ((i * 7 + (s > 0 ? 3 : 0)) % 4) * 4, col = ['#b7a48c', '#8f9aa3', '#c9b8a0', '#7d8a8f', '#a88f7a'][(i + (s > 0 ? 2 : 0)) % 5];
        const win = ctex(64, 128, (c, w, h) => { c.fillStyle = col; c.fillRect(0, 0, w, h); for (let y = 8; y < h; y += 16) for (let x = 6; x < w; x += 16) { c.fillStyle = o.night ? ((x * y) % 7 < 3 ? '#ffd27a' : '#1b2330') : '#5d7387'; c.fillRect(x, y, 9, 10); } });
        win.repeat.set(2, hgt / 4); box(g, 8.5, hgt, 8, M('#ffffff', 0.85, 0, { map: win, emissive: o.night ? '#ffffff' : '#000000', emissiveMap: o.night ? win : null, emissiveIntensity: o.night ? 0.35 : 0 }), s * 11.5, hgt / 2, -o.len / 2 + 4.5 + i * 9); }
      for (let z = -o.len / 2 + 5; z < o.len / 2; z += 12) { box(g, 0.12, 4.5, 0.12, M('#2b2d31', 0.4, 0.8), s * 4.4, 2.25, z); if (o.night) { const L = new T.PointLight('#ffd9a0', 1.2, 14, 2); L.position.set(s * 4.0, 4.4, z); g.add(L); } } });
    g.spots = { sidewalk: [5.2, 0.18, 0], road: [0, 0, 0], crossing: [0, 0, 8] }; g.cam = { pos: [2.5, 1.7, 14], look: [0, 2.0, -6], fov: 44 }; g.sky = o.night ? '#0d1424' : '#b9d9ef'; return g; };
})();
