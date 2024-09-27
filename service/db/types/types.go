package types

type RequestBody struct {
	AppID              string `json:"app_id"`              // required
	BuildID            string `json:"build_id"`            // required
	AppVersion         string `json:"app_version"`         // required
	AppEnvironment     string `json:"app_environment"`     // required
	SessionID          string `json:"session_id"`          // required
	SessionEmail       string `json:"session_email"`       // required
	DeviceType         string `json:"device_type"`         // required
	BrowserName        string `json:"browser_name"`        // required
	BrowserOS          string `json:"browser_os"`          // required
	BrowserVersion     string `json:"browser_version"`     // required
	LogType            string `json:"log_type"`            // required
	PageID             string `json:"page_id"`             // required
	PageURL            string `json:"page_url"`            // required
	ScreenResolution   string `json:"screen_resolution"`   // required
	ViewportSize       string `json:"viewport_size"`       // required
	MemoryUsage        int    `json:"memory_usage"`        // required
	NetworkType        string `json:"network_type"`        // required
	Language           string `json:"language"`            // required
	TimeZone           string `json:"time_zone"`           // required
	Referrer           string `json:"referrer"`            // optional
	PerformanceMetrics string `json:"performance_metrics"` // optional
	SDKVersion         string `json:"sdk_version"`         // required
	Time               int    `json:"time"`                // required
	Value              string `json:"value"`               // optional
	Stacktrace         string `json:"stacktrace"`          // optional
	Custom             string `json:"custom"`              // optional
}