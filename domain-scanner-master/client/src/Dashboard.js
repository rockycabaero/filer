import * as React from "react";
import { makeStyles } from "@material-ui/styles";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { Title } from "react-admin";

import ActionButton from "./ActionButton";

const getTimeDiff = (timestamp) => {
	const endTime = new Date();
	const startTime = new Date(timestamp);

	const milliseconds = endTime - startTime;
	const seconds = parseInt(milliseconds / 1000);

	let hh = parseInt(seconds / (60 * 60));
	let mm = parseInt(seconds / 60);
	let ss = seconds % 60;

	if (hh < 10) hh = `0${hh}`;

	if (mm < 10) mm = `0${mm}`;

	if (ss < 10) ss = `0${ss}`;

	return `${hh}:${mm}:${ss}`;
};

const useStyles = makeStyles((theme) => ({
	paper: {
		borderColor: theme.palette.primary.main,
		padding: theme.spacing(2),
	},
}));

const Dashboard = () => {
	const classes = useStyles();

	const [data, setData] = React.useState(null);

	React.useEffect(() => {
		const statusURL =
			process.env.NODE_ENV === "development"
				? "http://localhost:8080/api/status"
				: "/api/status";

		const evtSource = new EventSource(statusURL);

		evtSource.onmessage = (event) => {
			const _data = JSON.parse(event.data);
			setData(_data);
		};
		return () => evtSource.close();
	}, []);

	return (
		<Container maxWidth="md">
			<Card>
				<Title title="Domain App" />
				<CardContent>
					{data && !data.active && (
						<Box display="flex" justifyContent="center" my={4}>
							<Typography variant="h1">DEACTIVATED</Typography>
						</Box>
					)}
					{data && data.active && data.status === "scanning" && (
						<Box display="flex" justifyContent="center" py={4}>
							<Paper
								variant="outlined"
								className={classes.paper}
								style={{ marginRight: "2rem" }}
							>
								<Typography variant="h2">
									{getTimeDiff(data && data.data.startTimestamp)}
								</Typography>
							</Paper>
							<Paper variant="outlined" className={classes.paper}>
								<Typography variant="h2">
									{(data && data.data.scanned) || 0} /{" "}
									<span style={{ fontSize: "1.5rem", fontWeight: 400 }}>
										{(data && data.data.total) || 0}
									</span>
								</Typography>
							</Paper>
						</Box>
					)}

					<Box display="flex" justifyContent="center">
						<Box style={{ textAlign: "center" }}>
							<ActionButton data={data} />
						</Box>
					</Box>
				</CardContent>
			</Card>
		</Container>
	);
};

export default Dashboard;
