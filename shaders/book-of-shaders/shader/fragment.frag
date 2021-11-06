#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

void main() {
    vec2 xy = gl_FragCoord.xy/u_resolution;
    vec2 c = u_mouse/u_resolution;
    float d = length(xy - c);
	gl_FragColor = vec4(d, 0.0, 0.0, 1.0);
}
