import { observer } from 'mobx-react-lite'
import { useEffect, useId, type FC } from 'react'
import { useForm } from 'react-hook-form'
import type { z } from 'zod'
import { STATUS } from '@/shared/types'
import { BaseForm, Button, Card, Form, Skeleton } from '@/shared/ui'
import userPageStore from '../model/userPage.store'
import {
	FIELDS_CARD,
	formSchema,
	optionsIgnoreNoiseOutliers,
	optionsIgnoreSoundOutliers,
} from './constant'

interface DefaultSettingsProps {}

const MapComponent = {
	[STATUS.INITIAL]: () => <DefaultSettingsLoading />,
	[STATUS.LOADING]: () => <DefaultSettingsLoading />,
	[STATUS.SUCCESS]: () => <DefaultSettingsSuccess />,
	[STATUS.ERROR]: () => <DefaultSettingsError />,
}

const DefaultSettingsLoading = () => {
	return (
		<div>
			<div className="flex flex-col space-y-3">
				<div className="flex gap-3">
					<div className="w-full space-y-4">
						<Skeleton className="max-w-1/3 h-8 w-full rounded-md" />
						<Skeleton className="max-w-1/3 h-8 w-full rounded-md" />
					</div>
					<div className="w-full space-y-4">
						<Skeleton className="max-w-1/3 h-8 w-full rounded-md" />
						<Skeleton className="max-w-1/3 h-8 w-full rounded-md" />
					</div>
					<div className="w-full space-y-4">
						<Skeleton className="max-w-1/3 h-8 w-full rounded-md" />
						<Skeleton className="max-w-1/3 h-8 w-full rounded-md" />
					</div>
				</div>
				<div className="flex gap-3">
					<div className="w-full space-y-4">
						<Skeleton className="max-w-1/2 h-7 w-full rounded-md" />
						<Skeleton className="max-w-1/2 h-8 w-full rounded-md" />
					</div>
					<div className="w-full space-y-4">
						<Skeleton className="max-w-1/2 h-7 w-full rounded-md" />
						<Skeleton className="max-w-1/2 h-8 w-full rounded-md" />
					</div>
				</div>
				<div className="flex gap-3">
					<div className="w-full space-y-4">
						<Skeleton className="max-w-1/2 h-6 w-full rounded-md" />
						<Skeleton className="max-w-1/2 h-9 w-full rounded-md" />
					</div>
					<div className="w-full space-y-4">
						<Skeleton className="max-w-1/2 h-6 w-full rounded-md" />
						<Skeleton className="max-w-1/2 h-9 w-full rounded-md" />
					</div>
				</div>
				<div className="flex gap-3">
					<Skeleton className="max-w-1/2 h-10 w-full rounded-md" />
					<Skeleton className="max-w-1/2 h-10 w-full rounded-md" />
				</div>
			</div>
		</div>
	)
}

const DefaultSettingsSuccess = () => {
	const formId = useId()

	const form = useForm<z.infer<typeof formSchema>>({
		defaultValues: userPageStore.getSetting!,
	})

	const onSubmit = async (payload: z.infer<typeof formSchema>) => {
		await userPageStore.updateFileSetting(payload)
	}

	return (
		<div className="space-y-2">
			<Form {...form}>
				<form
					id={formId}
					className="flex flex-col space-y-2"
					onSubmit={form.handleSubmit(onSubmit)}
				>
					<div className="flex gap-3">
						<BaseForm.BaseFieldSlider
							step={0.1}
							min={0.2}
							max={1.5}
							className="w-1/3"
							{...FIELDS_CARD.window_size}
						/>
						<BaseForm.BaseFieldSlider
							step={0.1}
							min={0.1}
							max={1.5}
							className="w-1/3"
							{...FIELDS_CARD.window_step}
						/>
						<BaseForm.BaseFieldSlider
							step={0.01}
							min={0.7}
							max={1}
							className="w-1/3"
							{...FIELDS_CARD.confidence_limit}
						/>
					</div>
					<div className="flex gap-3">
						<BaseForm.BaseFieldSlider
							min={0}
							step={0.01}
							max={2}
							className="w-1/2"
							{...FIELDS_CARD.min_sound_length}
						/>
						<BaseForm.BaseFieldSlider
							step={0.1}
							min={0}
							max={50}
							labelTbumb={(value) => `${value}%`}
							className="w-1/2"
							{...FIELDS_CARD.offset_bounds}
						/>
					</div>
					<div className="flex gap-3">
						<BaseForm.BaseFieldSelect
							className="w-1/2"
							options={optionsIgnoreSoundOutliers}
							{...FIELDS_CARD.ignore_sound_outliers}
						/>
						<BaseForm.BaseFieldSelect
							className="w-1/2"
							options={optionsIgnoreNoiseOutliers}
							{...FIELDS_CARD.ignore_noise_outliers}
						/>
					</div>
				</form>
			</Form>
			<div className="flex gap-3">
				<Button form={formId} type="submit" className="w-full">
					Сохранить
				</Button>
				<Button
					className="w-full"
					variant="destructive"
					onClick={() => form.reset(userPageStore.getSetting!)}
				>
					Сбросить
				</Button>
			</div>
		</div>
	)
}

const DefaultSettingsError = () => {
	return (
		<div className="flex min-h-[342px] items-center justify-center text-center text-red-500">
			Ошибка при загрузке настроек по умолчанию
		</div>
	)
}

export const DefaultSettings: FC<DefaultSettingsProps> = observer(() => {
	useEffect(() => {
		userPageStore.fetchDefaultSetting()
	}, [])

	const Component = MapComponent[userPageStore.settingStatus] || null
	if (!Component) return null

	return (
		<Card className="w-full max-w-full p-4">
			<Component />
		</Card>
	)
})
