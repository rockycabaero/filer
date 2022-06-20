import * as React from "react";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import { useNotify } from "react-admin";
import axios from "axios";

const ActionButton = ({ data }) => {
	const notify = useNotify();

	const [active, setActive] = React.useState(false);
	const [loading, setLoading] = React.useState(true);

	const handleStart = async () => {
		try {
			setLoading(true);
			const { data } = await axios.post("/api/actions/start");

			notify(data.message);
		} catch (err) {
			notify(err.response.data.message || err.message);
		} finally {
			setLoading(false);
		}
	};

	const handleStop = async () => {
		try {
			setLoading(true);
			const { data } = await axios.post("/api/actions/stop");

			notify(data.message);
		} catch (err) {
			notify(err.response.data.message || err.message);
		} finally {
			setLoading(false);
		}
	};

	const handleStateChange = (e) => {
		if (e.target.checked) {
			handleStart();
		} else {
			handleStop();
		}
	};

	React.useEffect(() => {
		if (data) {
			setLoading(false);
			setActive(data.active);
		}
	}, [data]);

	return (
		<FormControlLabel
			control={<Switch />}
			label="Activate Scanner"
			onChange={handleStateChange}
			disabled={loading}
			checked={active}
		/>
	);
};

export default ActionButton;
