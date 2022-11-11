import React from "react";
import { Link } from "react-router-dom";

const NoMatch: React.FC = () => (
	<div className="site-layout-content">
		<h2>Страница не найдена!</h2>
		<p>
			<Link to="/">На главную страницу</Link>
		</p>
	</div>
);

export default NoMatch;